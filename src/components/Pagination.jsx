export default function Pagination({ page, setPage, totalPages }) {
  const pages = getVisiblePages(page, totalPages);
  const goToPage = (nextPage) => {
    if (nextPage < 1 || nextPage > totalPages || nextPage === page) {
      return;
    }

    setPage(nextPage);
  };

  return (
    <div style={styles.wrapper}>
      <p style={styles.pageSummary}>Pagina {page} de {totalPages}</p>

      <div style={styles.controlsRow}>
        <button onClick={() => goToPage(1)} disabled={page === 1} style={styles.navButton}>
          ⏮️
        </button>

        <button onClick={() => goToPage(page - 1)} disabled={page === 1} style={styles.navButton}>
          ⬅️
        </button>

        <div style={styles.pagesScroller}>
          <div style={styles.pagesContainer}>
            {pages.map((item, index) => (
              item === "ellipsis" ? (
                <span key={`ellipsis-${index}`} style={styles.ellipsis}>
                  ...
                </span>
              ) : (
                <button
                  key={item}
                  onClick={() => goToPage(item)}
                  aria-current={page === item ? "page" : undefined}
                  style={{
                    ...styles.pageButton,
                    ...(page === item ? styles.activePageButton : {})
                  }}
                >
                  {item}
                </button>
              )
            ))}
          </div>
        </div>

        <button onClick={() => goToPage(page + 1)} disabled={page === totalPages} style={styles.navButton}>
          ➡️
        </button>

        <button onClick={() => goToPage(totalPages)} disabled={page === totalPages} style={styles.navButton}>
          ⏭️
        </button>
      </div>
    </div>
  );
}

function getVisiblePages(currentPage, totalPages) {
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, index) => index + 1);
  }

  if (currentPage <= 4) {
    return [1, 2, 3, 4, 5, "ellipsis", totalPages];
  }

  if (currentPage >= totalPages - 3) {
    return [1, "ellipsis", totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1, totalPages];
  }

  return [
    1,
    "ellipsis",
    currentPage - 1,
    currentPage,
    currentPage + 1,
    "ellipsis",
    totalPages
  ];
}

const styles = {
  wrapper: {
    marginTop: "20px",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    gap: "12px",
    width: "100%"
  },
  pageSummary: {
    margin: 0,
    color: "#cbd5e1",
    fontSize: "14px",
    fontWeight: "600"
  },
  controlsRow: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "8px",
    flexWrap: "wrap"
  },
  pagesScroller: {
    maxWidth: "100%",
    overflowX: "auto",
    paddingBottom: "4px"
  },
  pagesContainer: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "8px",
    minWidth: "max-content"
  },
  navButton: {
    background: "#1e293b",
    color: "#fff",
    border: "1px solid #334155",
    padding: "8px 12px",
    borderRadius: "8px",
    cursor: "pointer"
  },
  pageButton: {
    minWidth: "40px",
    background: "#1e293b",
    color: "#fff",
    border: "1px solid #334155",
    padding: "8px 12px",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: "normal"
  },
  ellipsis: {
    color: "#94a3b8",
    minWidth: "24px",
    textAlign: "center",
    fontWeight: "bold"
  },
  activePageButton: {
    background: "#38bdf8",
    color: "#0f172a",
    fontWeight: "bold",
    border: "1px solid #38bdf8"
  }
};
