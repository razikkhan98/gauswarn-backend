const monthlyReportModal = require("../../model/admin/monthlyReportModal");

exports.getAllSales = async (req, res) => {
  try {
    const { year, month } = req.query;

    if (!year && !month) {
      return res.status(400).json({ error: "Year and month are required." });
    }

    const data = await monthlyReportModal.getEveryMonthData(year, month);

    if (data.message === "no data found") {
      return res.status(404).json({ message: "no data found" });
    }

    res.json({ data });
  } catch (error) {
    console.error("Error fetching sales data:", error);
    res.status(500).json({ error: "Failed to fetch sales data" });
  }
};
