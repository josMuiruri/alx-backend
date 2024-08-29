#!/usr/bin/env python3
'''pagination helper function'''
from typing import Tuple
''' a func that takes 2 int args & return a tuple containing 
a start & an end corresponding to the range of indexes
'''


def index_range(page: int, page_size: int) -> Tuple:
    ''' assigning a start index '''
    start_index = (page - 1) * page_size
    ''' assigning an end index '''
    end_index = start_index + page_size
    return start_index, end_index
