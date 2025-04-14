const monthlyReportModal = require("../../model/admin/monthlyReportModal");
// ghee
exports.getAllSales = async (req, res) => {
  try {
    const { year, month } = req.query;

    if (!year && !month) {
      return res.json({
        success: false,
        error: "Year and month are required.",
      });
    }

    const data = await monthlyReportModal.getEveryMonthData(year, month);

    if (data.message === "no data found") {
      return res.json({ success: false, message: "no data found" });
    }

    res.json({ data });
  } catch (error) {
    console.error("Error fetching sales data:", error);
    res.json({ success: false, error: "Failed to fetch sales data" });
  }
};

// ghee
exports.getTop5Users = async (req, res) => {
  try {
    const { year, month, limit } = req.query;
    const data = await monthlyReportModal.getTop5UsersTotalAmount(
      year,
      month,
      limit
    );

    if (!data) {
      return res.json({ success: true, message: "no data found" });
    }

    res.json({ data });
  } catch (error) {
    console.error("Error fetching sales data:", error);
    res.json({ success: false, error: "Failed to fetch sales data" });
  }
};

// rajlaxmi
