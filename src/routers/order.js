const express = require("express");
const { Order, User } = require("../schemas");
const jwt = require("jsonwebtoken");
const getDistanceFromLatLonInKm = require("../utils/calculateDistance");

const router = express.Router();

// I may have to use socket.io for realtime status updates
// still didn't figure out how am going to handle location updates

router.get("/all", async (req, res) => {
  try {
    const orders = await Order.find();
    res.send(orders);
  } catch (err) {
    console.log(err);
    res.status(500).send(err);
  }
});

router.post("/create", async (req, res) => {
  // order gets created here
  // fetch client, job , jobTag, longitude, latitude ,
  // isScheduled , time
  //  note
  const order = req.body;
  // fetch pros with job, online=true ,
  // location = in range
  //  order by rating
  const maybePros = await User.find()
    .and({ online: true })
    .and({ job: order.job })
    .and({ _id: "5dd5c57a7aea36646c9068cf" });

  const rankedByDistance = maybePros
    .map(item => {
      const distanceFromClient = getDistanceFromLatLonInKm(
        order.latitude,
        order.longitude,
        item.latitude,
        order.longitude
      );
      return { ...item, distanceFromClient };
    })
    .sort((a, b) => {
      return a.distanceFromClient - b.distanceFromClient;
    })
    .splice(0, 15);

  // send notification to requested users 15 users TODO: send push notification

  const requestedPros = rankedByDistance.map(item => item._id);

  const orderCol = new Order({
    client: order.client,
    job: order.job,
    jobTags: order.jobTags,
    longitude: order.longitude,
    latitude: order.latitude,
    status: "pending",
    requestedPros,
    candidatePros: [],
    acceptedPro: null,
    scheduled: order.scheduled,
    scheduleTime: order.scheduled,
    note: order.note
  });
  // save to db with order = pending, requestedPros = [{...15 pros}]
  // candidatePros = [] , confirmedUser = null
});

router.put("/accept_order", (req, res) => {
  // pro accepts order
  // fetch order_id,pro_id
  // notify client (if order has a life of > 3min)
  // update order candidatePros = [...pro]
});

router.put("/confirm_order", (req, res) => {
  // client confirms a pro
  // fetch order_id, pro_id
  // notify confirmed pro
  // update order, confirmedPro = {...pro}, status=ongoing
  // update pro, onlineStatus = false currentJob = {orderId}
});

router.put("/mark_done", (req, res) => {
  // maybe version 2
  // fetch order id, client_rating, pro_rating
  // mark done only if 20 mins has passed
  // so that they can't do it instead or cancel
  // OR
  // mark done if both the pro and client approve of
  // update order, status=done
  // update user rating
});

router.put("/cancel", (req, res) => {
  // fetch order id, user_id_who_canceled
  // update order, status=canceled
  // update pro, online true
  // update canceling use rating, drop by some value
});

router.get("/random_token", async (req, res) => {
  const token = jwt.sign({ some: "some" }, process.env.JWT_SECRET);
  res.send(token);
});

module.exports = router;
