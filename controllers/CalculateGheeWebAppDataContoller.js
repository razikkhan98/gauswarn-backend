const CalculateGheeWebAppDataModal = require("../model/CalculateGheeWebAppDataModal");

exports.getAllSales = async (req, res) => {
  try {
    const data =
      await CalculateGheeWebAppDataModal.getWeeklyMonthlySixMonthlyData();
    res.status(200).json({ data });
  } catch (error) {
    console.error("Error fetching products:", error);
    res.json({ error: "Failed to fetch products" });
  }
};
