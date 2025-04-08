const monthlyReportModal = require("../../model/admin/monthlyReportModal");

exports.getAllSales = async (req, res) => {
  try {
    const data =
      await monthlyReportModal.getEveryWeeklyMonthlyEverySixMonthlyData();
    res.json({ data });
    console.log('data: ', data);
    

  } catch (error) {
    console.error("Error fetching products:", error);
    res.json({ error: "Failed to fetch products" });
  }
};
