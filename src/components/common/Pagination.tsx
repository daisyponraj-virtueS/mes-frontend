const Pagination = (props: any) => {
  const { totalItems, itemsPerPage, onPageChange, currentPage, previous, next } = props;

  const totalPages = Math.ceil(totalItems / itemsPerPage);

  const pageNumbers = Array.from({ length: totalPages }, (_, index) => index + 1);

  const handlePageChange = (newPage: any) => {
    if (newPage >= 1 && newPage <= totalPages) {
      onPageChange(newPage);
    }
  };

  if (totalPages <= 1) {
    return null;
  }

  return (
    <div className='pagination-container'>
      <div
        className={`pagination-btn pagination-btn--prev ${!previous ? 'disabled' : ''}`}
        onClick={() => previous && handlePageChange(currentPage - 1)}
      >
        <div className='arrow-left-container mr-4'>
          <svg width='14' height='14' viewBox='0 0 14 14' fill='none'>
            <path
              d='M12.8332 7H1.1665'
              stroke='#989A9C'
              stroke-width='2'
              stroke-linecap='round'
              stroke-linejoin='round'
            />
            <path
              d='M6.99984 12.8334L1.1665 7.00008L6.99984 1.16675'
              stroke='#989A9C'
              stroke-width='2'
              stroke-linecap='round'
              stroke-linejoin='round'
            />
          </svg>
        </div>
        Previous
      </div>
      <div className='pagination-count-wrapper mx-3'>
        {pageNumbers.map((pageNumber) => (
          <div
            key={pageNumber}
            className={`pagination-count__item ${currentPage === pageNumber ? 'active' : ''}`}
            onClick={() => handlePageChange(pageNumber)}
          >
            {pageNumber}
          </div>
        ))}
      </div>
      <div
        className={`pagination-btn pagination-btn--next ${!next ? 'disabled' : ''}`}
        onClick={() => next && handlePageChange(currentPage + 1)}
      >
        Next
        <div className='arrow-right-container ml-4'>
          <svg width='14' height='14' viewBox='0 0 14 14' fill='none'>
            <path
              d='M12.8332 7H1.1665'
              stroke='#989A9C'
              stroke-width='2'
              stroke-linecap='round'
              stroke-linejoin='round'
            />
            <path
              d='M6.99984 12.8334L1.1665 7.00008L6.99984 1.16675'
              stroke='#989A9C'
              stroke-width='2'
              stroke-linecap='round'
              stroke-linejoin='round'
            />
          </svg>
        </div>
      </div>
    </div>
  );
};

export default Pagination;
