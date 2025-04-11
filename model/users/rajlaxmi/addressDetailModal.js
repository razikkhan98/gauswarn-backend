const { withConnection } = require("../../../utils/helper");

exports.addAddressDetails = async (userData) => {
  try {
    const {
      uid,
      user_city,
      user_country,
      user_email,
      user_house_number,
      user_landmark,
      user_mobile_num,
      user_name,
      user_pincode,
      user_state,
    } = userData;

    return await withConnection(async (connection) => {
      const query = `
        INSERT INTO rajlaxmi_address_details
        (full_name, email, address, house_no, country, contact_no, state, city, pincode, user_id)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `;

      const [result] = await connection.execute(query, [
        user_name,
        user_email,
        user_landmark,
        user_house_number,
        user_country,
        user_mobile_num,
        user_state,
        user_city,
        user_pincode,
        uid,
      ]);

      return result?.insertId;
    });
  } catch (error) {
    throw new Error(error.message);
  }
};

exports.getAllAddressDetails = async () => {
  return await withConnection(async (connection) => {
    const [rows] = await connection.execute(
      `SELECT * FROM rajlaxmi_address_details`
    );
    return rows;
  });
};

exports.getAddressDetailsById = async (user_id) => {
  return await withConnection(async (connection) => {
    const [rows] = await connection.execute(
      `SELECT * FROM rajlaxmi_address_details WHERE user_id = ?`,
      [user_id]
    );
    return rows;
  });
};

exports.updateAddressDetails = async (userData) => {
  const {
    full_name,
    email,
    address,
    house_no,
    country,
    contact_no,
    state,
    city,
    pincode,
    user_id,
    id,
  } = userData;

  return await withConnection(async (connection) => {
    const query = `
      UPDATE rajlaxmi_address_details SET
        full_name = ?, email = ?, address = ?, house_no = ?, country = ?,
        contact_no = ?, state = ?, city = ?, pincode = ?, user_id = ?
      WHERE id = ? AND user_id = ?
    `;

    const [result] = await connection.execute(query, [
      full_name,
      email,
      address,
      house_no,
      country,
      contact_no,
      state,
      city,
      pincode,
      id,
      user_id,
    ]);

    return result.affectedRows;
  });
};

exports.deleteAddressDetails = async (id, user_id) => {
  return await withConnection(async (connection) => {
    const [result] = await connection.execute(
      `DELETE FROM rajlaxmi_address_details WHERE id = ? AND user_id = ?`,
      [id, user_id]
    );
    return result.affectedRows;
  });
};
