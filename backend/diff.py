# Thực hiện và xác minh thuật toán đồng bộ
# Giải thích thuật toán:
# 1. Sử dụng bảng hash (defaultdict) để xây dựng ánh xạ từ content_hash đến chunks, độ phức tạp thời gian O(n)
# 2. Sử dụng phép toán tập hợp để tìm chunks ở cùng vị trí, độ phức tạp thời gian O(n)
# 3. Sử dụng phương pháp hai con trỏ để khớp các chunks còn lại, độ phức tạp thời gian O(n)
# Độ phức tạp thời gian tổng thể: O(n), trong đó n là tổng số chunks
# Độ phức tạp không gian: O(n), chủ yếu dùng để lưu trữ bảng hash

from collections import defaultdict
from typing import TypedDict, List, Dict, Set
from dataclasses import dataclass

@dataclass
class Chunk:
    index: int
    content_hash: str
    chunk_content: str
    uuid: str = ""

class SyncResult(TypedDict):
    to_create: List[Dict]
    to_update: List[Dict]
    to_delete: List[str]

# Mô phỏng dữ liệu chunks cũ của backend
old_chunks = [
    {'uuid': 'uuid_1', 'index': 0, 'content_hash': 'hash_A', 'chunk_content': 'Đây là đoạn thứ nhất.'},
    {'uuid': 'uuid_2', 'index': 1, 'content_hash': 'hash_B', 'chunk_content': 'Đây là đoạn thứ hai.'},
    {'uuid': 'uuid_3', 'index': 2, 'content_hash': 'hash_C', 'chunk_content': 'Đây là đoạn thứ ba.'},
    {'uuid': 'uuid_4', 'index': 3, 'content_hash': 'hash_D', 'chunk_content': 'Đây là đoạn thứ tư.'},
    {'uuid': 'uuid_5', 'index': 4, 'content_hash': 'hash_E', 'chunk_content': 'Đây là đoạn thứ năm.'},
]

# Mô phỏng dữ liệu chunks mới được tạo bởi GitHub Actions
new_chunks = [
    {'index': 0, 'content_hash': 'hash_A', 'chunk_content': 'Đây là đoạn thứ nhất.'},
    {'index': 1, 'content_hash': 'hash_C', 'chunk_content': 'Đây là đoạn thứ ba.'},
    {'index': 2, 'content_hash': 'hash_D', 'chunk_content': 'Đây là đoạn thứ tư.'},
    {'index': 3, 'content_hash': 'hash_D', 'chunk_content': 'Đây là đoạn thứ tư.'},
    {'index': 4, 'content_hash': 'hash_D', 'chunk_content': 'Đây là đoạn thứ tư.'},
    {'index': 5, 'content_hash': 'hash_D', 'chunk_content': 'Đây là đoạn thứ tư.'},
    {'index': 6, 'content_hash': 'hash_D', 'chunk_content': 'Đây là đoạn thứ tư.'},
]

def synchronize_chunks(old_chunks: List[Dict], new_chunks: List[Dict]) -> SyncResult:
    """
    Thuật toán khớp hai con trỏ dựa trên content_hash + index, tìm các chunks cần thêm, cập nhật và xóa.
    Cải tiến chính:
    1. Đối với các chunks cũ và mới có cùng content_hash, sắp xếp riêng theo index, sau đó khớp từng cái một, 
       tránh việc dựa trực tiếp vào "vị trí giống nhau" dẫn đến nhầm lẫn khi có content_hash trùng lặp.
    2. Giữ lại việc đánh giá ngưỡng khoảng cách ban đầu (distance <= threshold), nhưng logic trực quan hơn, 
       giảm thiểu việc bỏ sót hoặc đánh giá sai.
    """

    # ========== 1. Xác thực đầu vào ==========
    if not isinstance(old_chunks, list) or not isinstance(new_chunks, list):
        raise TypeError("Tham số đầu vào phải là kiểu danh sách")

    required_fields = {'index', 'content_hash', 'chunk_content'}
    for chunk in old_chunks:
        if not required_fields.union({'uuid'}).issubset(chunk.keys()):
            raise ValueError("Chunks cũ thiếu trường bắt buộc")
    for chunk in new_chunks:
        if not required_fields.issubset(chunk.keys()):
            raise ValueError("Chunks mới thiếu trường bắt buộc")

    # ========== 2. Xây dựng bảng ánh xạ content_hash => chunks, giảm việc khớp sai qua content_hash ==========
    old_chunks_by_hash = defaultdict(list)
    for oc in old_chunks:
        old_chunks_by_hash[oc['content_hash']].append(oc)

    new_chunks_by_hash = defaultdict(list)
    for nc in new_chunks:
        new_chunks_by_hash[nc['content_hash']].append(nc)

    # ========== 3. Duyệt qua tất cả content_hash, khớp từng cái một ==========

    to_create = []
    to_update = []
    to_delete = []

    # Tập hợp "hợp" để lấy tất cả content_hash đã xuất hiện
    all_hashes = set(old_chunks_by_hash.keys()) | set(new_chunks_by_hash.keys())

    # Ngưỡng khoảng cách cập nhật cho phép, có thể điều chỉnh tăng hoặc giảm theo nhu cầu
    threshold = 10

    for content_hash in all_hashes:
        old_list = sorted(old_chunks_by_hash[content_hash], key=lambda x: x['index'])
        new_list = sorted(new_chunks_by_hash[content_hash], key=lambda x: x['index'])

        i, j = 0, 0
        len_old, len_new = len(old_list), len(new_list)

        while i < len_old and j < len_new:
            old_entry = old_list[i]
            new_entry = new_list[j]
            distance = abs(old_entry['index'] - new_entry['index'])

            # Nếu chỉ số gần nhau, thì coi là cùng một khối nội dung, thực hiện thao tác cập nhật
            if distance <= threshold:
                to_update.append({
                    'uuid': old_entry['uuid'],
                    'index': new_entry['index'],
                    'content_hash': content_hash,
                    'chunk_content': new_entry['chunk_content']
                })
                i += 1
                j += 1

            # Nếu chunk.index cũ nhỏ hơn, có nghĩa là nó không có cặp phù hợp trong danh sách mới, cần xóa
            elif old_entry['index'] < new_entry['index']:
                to_delete.append(old_entry['uuid'])
                i += 1

            # Ngược lại, chunk.index mới nhỏ hơn, có nghĩa là đây là khối mới được thêm vào
            else:
                to_create.append({
                    'index': new_entry['index'],
                    'content_hash': content_hash,
                    'chunk_content': new_entry['chunk_content']
                })
                j += 1

        # Coi các chunks cũ còn lại là cần xóa
        while i < len_old:
            to_delete.append(old_list[i]['uuid'])
            i += 1

        # Coi các chunks mới còn lại là cần thêm mới
        while j < len_new:
            to_create.append({
                'index': new_list[j]['index'],
                'content_hash': content_hash,
                'chunk_content': new_list[j]['chunk_content']
            })
            j += 1

    return {
        'to_create': to_create,
        'to_update': to_update,
        'to_delete': to_delete
    }

if __name__ == '__main__':
    result = synchronize_chunks(old_chunks, new_chunks)

    print("Các chunks cần tạo:")
    if result['to_create']:
        for chunk in result['to_create']:
            print(chunk)
    else:
        print("null")

    print("\nCác chunks cần cập nhật:")
    if result['to_update']:
        for chunk in result['to_update']:
            print(chunk)
    else:
        print("null")

    print("\nCác chunks cần xóa:")
    if result['to_delete']:
        for uuid in result['to_delete']:
            print(uuid)
    else:
        print("null")
