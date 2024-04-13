const CommonUtil = require("../common/common.util");

const getById = async (orderId) => {
  const AxiosInstance = CommonUtil.getAxiosInsance(
    process.env.ORDER_SERVICE_BASE_URL
  );
  const response = await AxiosInstance.get(`/orders/${orderId}`)
    .then((res) => {
      return CommonUtil.buildAxiosResponse(true, res.data);
    })
    .catch((err) => {
      console.log(err);
      return CommonUtil.buildAxiosResponse(
        false,
        err.response.data,
        err.response.status
      );
    });

  return response;
};

const updateOrderStatus = async (orderId, status) => {
  const AxiosInstance = CommonUtil.getAxiosInsance(
    process.env.ORDER_SERVICE_BASE_URL
  );
  const response = await AxiosInstance.patch(`/orders/${orderId}/status`, {
    status,
  })
    .then((res) => {
      return CommonUtil.buildAxiosResponse(true, res.data);
    })
    .catch((err) => {
      console.log(err);
      return CommonUtil.buildAxiosResponse(
        false,
        err.response.data,
        err.response.status
      );
    });

  return response;
};

module.exports = { getById, updateOrderStatus };
