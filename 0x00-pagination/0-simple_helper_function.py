#!/usr/bin/env python3
'''pagination helper function'''
from typing import Tuple
'''a func that retrieves the index range from a given page and page size'''


def index_range(page: int, page_size: int) -> Tuple:
    ''' assigning a start index '''
    start_index = (page - 1) * page_size
    ''' assigning an end index '''
    end_index = start_index + page_size
    return start_index, end_index
