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

exports.getTop5UsersTotalAmountRajlaxmi = async (req, res) => {
  try {
    const { year, month, limit } = req.query;
    const data = await monthlyReportModal.getTop5UsersTotalAmountRajlaxmi(
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

exports.getTotalOrdersRajlaxmi = async (req, res) => {
  try {
    const { month, year } = req.query;

    if (!month || !year) {
      return res.json({
        success: false,
        message: "Month and Year are required as query parameters",
      });
    }

    const total_order = await monthlyReportModal.getTotalOrdersRajlaxmi(
      year,
      month
    );

    res.json({
      success: true,
      data: total_order,
    });
  } catch (error) {
    console.error("Error in  Total Orders Rajlaxmi", error);
    res.json({
      success: false,
      error: error.message,
    });
  }
};

exports.getTotalUsers = async (req, res) => {
  try {
    // const { month, year } = req.query;

    // if (!month || !year) {
    //   return res.json({
    //     success: false,
    //     message: "Month and Year are required as query parameters",
    //   });
    // }

    const total_users = await monthlyReportModal.getTotalUsers();
    // year,
    // month

    res.json({
      success: true,
      data: total_users,
    });
  } catch (error) {
    console.error("Error in  Total Orders Rajlaxmi", error);
    res.json({
      success: false,
      error: error.message,
    });
  }
};
