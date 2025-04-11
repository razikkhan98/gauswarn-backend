const moment = require("moment/moment");
const { withConnection, calculateProfit } = require("../../utils/helper");

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
        FROM gauswarn_payment
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
        FROM gauswarn_payment
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
        FROM gauswarn_payment
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
        FROM gauswarn_payment
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
          gauswarn_payment
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
          FROM gauswarn_payment
          WHERE DATE BETWEEN ? AND ?;
        `;

      // Query for monthly data
      const monthlyQuery = `
          SELECT 
            COUNT(*) AS monthly_total_users, 
            SUM(user_total_amount) AS monthly_total_sales
          FROM gauswarn_payment
          WHERE DATE BETWEEN ? AND ?;
        `;

      // Query for last six months' data
      const sixMonthlyQuery = `
          SELECT 
            COUNT(*) AS six_monthly_total_users, 
            SUM(user_total_amount) AS six_monthly_total_sales
          FROM gauswarn_payment
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
          FROM gauswarn_payment
          WHERE DATE BETWEEN ? AND ?
          GROUP BY day;
        `;

      // Query for monthly data
      const monthlyQuery = `
          SELECT 
            COUNT(*) AS monthly_total_users, 
            SUM(user_total_amount) AS monthly_total_sales
          FROM gauswarn_payment
          WHERE DATE BETWEEN ? AND ?;
        `;

      // Query for last six months' data grouped by month
      const sixMonthlyQuery = `
          SELECT 
            DATE_FORMAT(DATE, '%Y-%m') AS month, 
            COUNT(*) AS monthly_total_users, 
            SUM(user_total_amount) AS monthly_total_sales
          FROM gauswarn_payment
          WHERE DATE BETWEEN ? AND ?
          GROUP BY month;
        `;

      // Query for monthly data
      const monthlyQueryPrice = `
SELECT * FROM gauswarn_payment
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

      // get the total order in monthly database

      const totalOrdersQuery = `
  SELECT COUNT(*) AS total_orders 
  FROM gauswarn_payment
  WHERE DATE BETWEEN ? AND ?;
`;

      const [totalOrders] = await connection.execute(totalOrdersQuery, [
        startOfMonth,
        endOfMonth,
      ]);

      // get the Total Products  database
      const totalProductsQuery = `
            SELECT COUNT(*) AS total_products
            FROM gauswarn_product;
          `;

      const [totalProducts] = await connection.execute(totalProductsQuery);
      console.log("totalProducts: ", totalProducts);

      return {
        week: { start: startOfWeek, end: endOfWeek, data: weeklyData[0] },
        month: { start: startOfMonth, end: endOfMonth, data: monthlyData[0] },
        sixMonths: {
          start: startOfSixMonths,
          end: endOfSixMonths,
          data: sixMonthlyData[0],
        },
        monthlyProfit: totalProfit,
        totalOrders: totalOrders,
        totalProducts: totalProducts,
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
          FROM gauswarn_payment
          WHERE DATE BETWEEN ? AND ?
          GROUP BY day;
        `;

      const monthlyQuery = `
          SELECT 
            COUNT(*) AS monthly_total_users, 
            SUM(user_total_amount) AS monthly_total_sales, 
            SUM(user_cost) AS monthly_total_cost
          FROM gauswarn_payment
          WHERE DATE BETWEEN ? AND ?;
        `;

      const sixMonthlyQuery = `
          SELECT 
            DATE_FORMAT(DATE, '%Y-%m') AS month, 
            COUNT(*) AS monthly_total_users, 
            SUM(user_total_amount) AS monthly_total_sales, 
            SUM(user_cost) AS monthly_total_cost
          FROM gauswarn_payment
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

exports.getEveryMonthData = async (year, month) => {
  try {
    const startOfMonth = moment(`${year}-${month}-01`)
      .startOf("month")
      .format("YYYY-MM-DD");
    const endOfMonth = moment(`${year}-${month}-01`)
      .endOf("month")
      .format("YYYY-MM-DD");

    return await withConnection(async (connection) => {
      const paymentsQuery = `
        SELECT 
          user_total_amount, 
          purchase_price, 
          product_quantity 
        FROM gauswarn_payment
        WHERE DATE BETWEEN ? AND ?;
      `;
      const [payments] = await connection.execute(paymentsQuery, [
        startOfMonth,
        endOfMonth,
      ]);

      if (payments.length === 0) {
        return { message: "no data found" };
      }

      let monthlySales = 0;
      let totalProfit = 0;

      for (const payment of payments) {
        const { user_total_amount, purchase_price, product_quantity } = payment;

        monthlySales += user_total_amount;
        totalProfit += calculateProfit(
          user_total_amount,
          purchase_price,
          product_quantity
        );
      }

      const totalOrders = payments.length;

      const totalProductsQuery = `
        SELECT COUNT(*) AS total_products
        FROM gauswarn_product;
      `;
      const [[{ total_products }]] = await connection.execute(
        totalProductsQuery
      );

      return {
        month: {
          start: startOfMonth,
          end: endOfMonth,
          data: {
            monthly_total_users: totalOrders,
            monthly_total_sales: monthlySales,
          },
        },
        monthlyProfit: totalProfit,
        totalOrders,
        totalProducts: total_products,
      };
    });
  } catch (error) {
    console.error("Error in getEveryMonthData:", error);
    throw error;
  }
};

exports.getTop5UsersTotalAmount = async () => {
  try {
    const query = `
      SELECT
        user_id,
        user_total_amount
      FROM
        gauswarn_payment
      ORDER BY
        user_total_amount DESC
      LIMIT 5;
    `;

    const result = await withConnection(async (connection) => {
      const [results] = await connection.execute(query);
      return results || []; // Return an empty array if no results
    });

    console.log("Top 5 Users by Total Amount:", result);
    return result;
  } catch (error) {
    console.error("Error in getTop5UsersTotalAmount:", error);
    throw error;
  }
};
