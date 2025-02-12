const moment = require("moment/moment");
const { withConnection, calculateProfit } = require("../utils/helper");

// Get total users for a specific month
exports.getMonthlyUserCount = async (month, year) => {
  try {
    // Calculate start and end dates of the specified month
    const startOfMonth = moment(`${year}-${month}-01`)
      .startOf("month")
      .format("YYYY-MM-DD");
    const endOfMonth = moment(`${year}-${month}-01`)
      .endOf("month")
      .format("YYYY-MM-DD");

    return await withConnection(async (connection) => {
      const query = `
        SELECT COUNT(*) AS total_users 
        FROM organic_farmer_table_payment
        WHERE DATE BETWEEN ? AND ?;
      `;
      const [rows] = await connection.execute(query, [
        startOfMonth,
        endOfMonth,
      ]);
      return rows[0];
    });
  } catch (error) {
    console.error("Error in getMonthlyUserCount:", error);
    throw error;
  }
};

// Get total sales for a specific month
exports.getMonthlyTotalSales = async (month, year) => {
  try {
    // Calculate start and end dates of the specified month
    const startOfMonth = moment(`${year}-${month}-01`)
      .startOf("month")
      .format("YYYY-MM-DD");
    const endOfMonth = moment(`${year}-${month}-01`)
      .endOf("month")
      .format("YYYY-MM-DD");

    return await withConnection(async (connection) => {
      const query = `
        SELECT SUM(user_total_amount) AS total_sales 
        FROM organic_farmer_table_payment
        WHERE DATE BETWEEN ? AND ?;
      `;
      const [rows] = await connection.execute(query, [
        startOfMonth,
        endOfMonth,
      ]);
      return rows[0];
    });
  } catch (error) {
    console.error("Error in getMonthlyTotalSales:", error);
    throw error;
  }
};

// Get user count for a specific week
exports.getWeeklyUserCount = async (week, year) => {
  try {
    // Calculate start and end dates of the specified week
    const startOfWeek = moment()
      .year(year)
      .week(week)
      .startOf("week")
      .format("YYYY-MM-DD");
    const endOfWeek = moment()
      .year(year)
      .week(week)
      .endOf("week")
      .format("YYYY-MM-DD");

    return await withConnection(async (connection) => {
      const query = `
        SELECT COUNT(*) AS total_users 
        FROM organic_farmer_table_payment
        WHERE DATE BETWEEN ? AND ?;
      `;
      const [rows] = await connection.execute(query, [startOfWeek, endOfWeek]);
      return rows[0];
    });
  } catch (error) {
    console.error("Error in getWeeklyUserCount:", error);
    throw error;
  }
};

// Get total sales for a specific week
exports.getWeeklyTotalSales = async (week, year) => {
  try {
    // Calculate start and end dates of the specified week
    const startOfWeek = moment()
      .year(year)
      .week(week)
      .startOf("week")
      .format("YYYY-MM-DD");
    const endOfWeek = moment()
      .year(year)
      .week(week)
      .endOf("week")
      .format("YYYY-MM-DD");

    return await withConnection(async (connection) => {
      const query = `
        SELECT SUM(user_total_amount) AS total_sales 
        FROM organic_farmer_table_payment
        WHERE DATE BETWEEN ? AND ?;
      `;
      const [rows] = await connection.execute(query, [startOfWeek, endOfWeek]);
      return rows[0];
    });
  } catch (error) {
    console.error("Error in getWeeklyTotalSales:", error);
    throw error;
  }
};

exports.getAllTotalSalesMonthlyData = async () => {
  try {
    const endOfMonth = moment().endOf("month").format("YYYY-MM-DD");
    const startOfMonth = moment().startOf("month").format("YYYY-MM-DD");

    const result = await withConnection(async (connection) => {
      const query = `
        SELECT
          COUNT(*) AS total_users,
          SUM(user_total_amount) AS total_amount_collected
        FROM
          organic_farmer_table_payment
        WHERE
          DATE BETWEEN ? AND ?;
      `;

      const [results] = await connection.execute(query, [
        startOfMonth,
        endOfMonth,
      ]);

      return results[0] || { total_users: 0, total_amount_collected: 0 };
    });

    console.log("Result:", result);
    return result;
  } catch (error) {
    console.error("Error in getAllTotalSalesMonthlyData:", error);
    throw error;
  }
};

exports.getWeeklyMonthlySixMonthlyData = async () => {
  try {
    // Calculate current week range
    const startOfWeek = moment().startOf("week").format("YYYY-MM-DD");
    const endOfWeek = moment().endOf("week").format("YYYY-MM-DD");

    // Calculate current month range
    const startOfMonth = moment().startOf("month").format("YYYY-MM-DD");
    const endOfMonth = moment().endOf("month").format("YYYY-MM-DD");

    // Calculate last six months range
    const startOfSixMonths = moment()
      .subtract(6, "months")
      .startOf("month")
      .format("YYYY-MM-DD");
    const endOfSixMonths = moment().endOf("month").format("YYYY-MM-DD");

    return await withConnection(async (connection) => {
      // Query for weekly data
      const weeklyQuery = `
          SELECT 
            COUNT(*) AS weekly_total_users, 
            SUM(user_total_amount) AS weekly_total_sales
          FROM organic_farmer_table_payment
          WHERE DATE BETWEEN ? AND ?;
        `;

      // Query for monthly data
      const monthlyQuery = `
          SELECT 
            COUNT(*) AS monthly_total_users, 
            SUM(user_total_amount) AS monthly_total_sales
          FROM organic_farmer_table_payment
          WHERE DATE BETWEEN ? AND ?;
        `;

      // Query for last six months' data
      const sixMonthlyQuery = `
          SELECT 
            COUNT(*) AS six_monthly_total_users, 
            SUM(user_total_amount) AS six_monthly_total_sales
          FROM organic_farmer_table_payment
          WHERE DATE BETWEEN ? AND ?;
        `;

      // Execute all queries in parallel
      const [[weeklyData], [monthlyData], [sixMonthlyData]] = await Promise.all(
        [
          connection.execute(weeklyQuery, [startOfWeek, endOfWeek]),
          connection.execute(monthlyQuery, [startOfMonth, endOfMonth]),
          connection.execute(sixMonthlyQuery, [
            startOfSixMonths,
            endOfSixMonths,
          ]),
        ]
      );

      return {
        week: { start: startOfWeek, end: endOfWeek, data: weeklyData[0] },
        month: { start: startOfMonth, end: endOfMonth, data: monthlyData[0] },
        sixMonths: {
          start: startOfSixMonths,
          end: endOfSixMonths,
          data: sixMonthlyData[0],
        },
      };
    });
  } catch (error) {
    console.error("Error in getWeeklyMonthlySixMonthlyData:", error);
    throw error;
  }
};

exports.getEveryWeeklyMonthlyEverySixMonthlyData = async () => {
  try {
    const startOfWeek = moment().startOf("week").format("YYYY-MM-DD");
    const endOfWeek = moment().endOf("week").format("YYYY-MM-DD");

    const startOfMonth = moment().startOf("month").format("YYYY-MM-DD");
    const endOfMonth = moment().endOf("month").format("YYYY-MM-DD");

    const startOfSixMonths = moment()
      .subtract(6, "months")
      .startOf("month")
      .format("YYYY-MM-DD");
    const endOfSixMonths = moment().endOf("month").format("YYYY-MM-DD");

    return await withConnection(async (connection) => {
      // Query for weekly data grouped by day
      const weeklyQuery = `
          SELECT 
            DATE_FORMAT(DATE, '%Y-%m-%d') AS day, 
            COUNT(*) AS daily_total_users, 
            SUM(user_total_amount) AS daily_total_sales
          FROM organic_farmer_table_payment
          WHERE DATE BETWEEN ? AND ?
          GROUP BY day;
        `;

      // Query for monthly data
      const monthlyQuery = `
          SELECT 
            COUNT(*) AS monthly_total_users, 
            SUM(user_total_amount) AS monthly_total_sales
          FROM organic_farmer_table_payment
          WHERE DATE BETWEEN ? AND ?;
        `;

      // Query for last six months' data grouped by month
      const sixMonthlyQuery = `
          SELECT 
            DATE_FORMAT(DATE, '%Y-%m') AS month, 
            COUNT(*) AS monthly_total_users, 
            SUM(user_total_amount) AS monthly_total_sales
          FROM organic_farmer_table_payment
          WHERE DATE BETWEEN ? AND ?
          GROUP BY month;
        `;

      // Query for monthly data
      const monthlyQueryPrice = `
SELECT * FROM organic_farmer_table_payment
WHERE DATE BETWEEN ? AND ?;
`;
      const data = await connection.execute(monthlyQueryPrice, [
        startOfMonth,
        endOfMonth,
      ]);

      let totalProfit = 0;

      for (const d of data[0]) {
        const singleProductProfit = calculateProfit(
          d?.user_total_amount,
          d?.purchase_price,
          d?.product_quantity
        );

        totalProfit += singleProductProfit;
      }

      const [weeklyData, [monthlyData], sixMonthlyData] = await Promise.all([
        connection.execute(weeklyQuery, [startOfWeek, endOfWeek]),
        connection.execute(monthlyQuery, [startOfMonth, endOfMonth]),
        connection.execute(sixMonthlyQuery, [startOfSixMonths, endOfSixMonths]),
      ]);

      return {
        week: { start: startOfWeek, end: endOfWeek, data: weeklyData[0] },
        month: { start: startOfMonth, end: endOfMonth, data: monthlyData[0] },
        sixMonths: {
          start: startOfSixMonths,
          end: endOfSixMonths,
          data: sixMonthlyData[0],
        },
        monthlyProfit: totalProfit,
      };
    });
  } catch (error) {
    console.error("Error in getWeeklyMonthlySixMonthlyData:", error);
    throw error;
  }
};

exports.getEveryWeeklyMonthlyEverySixMonthlyDataTesting = async () => {
  try {
    const startOfWeek = moment().startOf("week").format("YYYY-MM-DD");
    const endOfWeek = moment().endOf("week").format("YYYY-MM-DD");

    const startOfMonth = moment().startOf("month").format("YYYY-MM-DD");
    const endOfMonth = moment().endOf("month").format("YYYY-MM-DD");

    const startOfSixMonths = moment()
      .subtract(6, "months")
      .startOf("month")
      .format("YYYY-MM-DD");
    const endOfSixMonths = moment().endOf("month").format("YYYY-MM-DD");

    return await withConnection(async (connection) => {
      // Queries
      const weeklyQuery = `
          SELECT 
            DATE_FORMAT(DATE, '%Y-%m-%d') AS day, 
            COUNT(*) AS daily_total_users, 
            SUM(user_total_amount) AS daily_total_sales, 
            SUM(user_cost) AS daily_total_cost
          FROM organic_farmer_table_payment
          WHERE DATE BETWEEN ? AND ?
          GROUP BY day;
        `;

      const monthlyQuery = `
          SELECT 
            COUNT(*) AS monthly_total_users, 
            SUM(user_total_amount) AS monthly_total_sales, 
            SUM(user_cost) AS monthly_total_cost
          FROM organic_farmer_table_payment
          WHERE DATE BETWEEN ? AND ?;
        `;

      const sixMonthlyQuery = `
          SELECT 
            DATE_FORMAT(DATE, '%Y-%m') AS month, 
            COUNT(*) AS monthly_total_users, 
            SUM(user_total_amount) AS monthly_total_sales, 
            SUM(user_cost) AS monthly_total_cost
          FROM organic_farmer_table_payment
          WHERE DATE BETWEEN ? AND ?
          GROUP BY month;
        `;

      // Execute queries
      const [weeklyData, [monthlyData], sixMonthlyData] = await Promise.all([
        connection.execute(weeklyQuery, [startOfWeek, endOfWeek]),
        connection.execute(monthlyQuery, [startOfMonth, endOfMonth]),
        connection.execute(sixMonthlyQuery, [startOfSixMonths, endOfSixMonths]),
      ]);

      // Calculate profits
      const calculateProfit = (sales, cost) => {
        return sales - cost;
      };

      // Weekly profit
      weeklyData[0].forEach((day) => {
        day.daily_profit = calculateProfit(
          day.daily_total_sales,
          day.daily_total_cost || 0
        );
      });

      // Monthly profit
      monthlyData[0].monthly_profit = calculateProfit(
        monthlyData[0].monthly_total_sales,
        monthlyData[0].monthly_total_cost || 0
      );

      // Six-monthly profit
      sixMonthlyData[0].forEach((month) => {
        month.monthly_profit = calculateProfit(
          month.monthly_total_sales,
          month.monthly_total_cost || 0
        );
      });

      // Return structured data
      return {
        week: {
          start: startOfWeek,
          end: endOfWeek,
          summary: weeklyData[0],
        },
        month: {
          start: startOfMonth,
          end: endOfMonth,
          summary: monthlyData[0],
        },
        sixMonths: {
          start: startOfSixMonths,
          end: endOfSixMonths,
          summary: sixMonthlyData[0],
        },
      };
    });
  } catch (error) {
    console.error("Error in getEveryWeeklyMonthlyEverySixMonthlyData:", error);
    throw error;
  }
};
