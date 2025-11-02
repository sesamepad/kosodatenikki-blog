import "@/styles/desktop/DesktopHomePage.css";

type Props = {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
};

export default function Pagination({
  currentPage,
  totalPages,
  onPageChange,
}: Props) {
  const handlePrev = () => {
    if (currentPage > 1) {
      onPageChange(currentPage - 1);
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages) {
      onPageChange(currentPage + 1);
    }
  };

  return (
    <div className="pagination">
      <button
        onClick={handlePrev}
        disabled={currentPage === 1}
        className="page-btn"
      >
        &lt; 前へ
      </button>

      {Number.isFinite(totalPages) &&
        totalPages > 0 &&
        Array.from({ length: totalPages }, (_, i) => i + 1).map((num) => (
          <button
            key={num}
            onClick={() => onPageChange(num)}
            className={`page-btn ${num === currentPage ? "active" : ""}`}
          >
            {num}
          </button>
        ))}

      <button
        onClick={handleNext}
        disabled={currentPage === totalPages}
        className="page-btn"
      >
        次へ &gt;
      </button>
    </div>
  );
}
