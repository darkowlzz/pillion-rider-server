import mongoose from 'mongoose';

const RIDE_COLLECTION = 'ride-pillion-1';
const STATS_COLLECTION = 'stats-pillion-1';

let uristring = process.env.MONGODB_URI || 'mongodb://localhost/pillion';

mongoose.connect(uristring, (err, res) => {
  if (err) {
    console.log('Error connecting to db', err);
  } else {
    console.log('Succeeded in connecting to db');
  }
});

let rideSchema = new mongoose.Schema({
  rideName: { type: String, 'default': 'Unknown' },
  rideID: { type: String },
  location: { type: String, 'default': 'Unknown' },
  time: { type: String, 'default': 'Unknown' },
  riderID: { type: String },
  riderPic: { type: String },
  riderName: { type: String },
  pillionID: { type: String, 'default': '' },
  pillionName: { type: String, 'default': '' },
  pillionPic: { type: String, 'default': ''}
});
let Ride = mongoose.model(RIDE_COLLECTION, rideSchema);

let ride = {
  create: (req, res) => {
    let data = req.body;

    stats.incRide(() => {
      stats.getStats((statsData) => {
        let aRide = new Ride({
          rideName: data.rideName,
          rideID: statsData.rides,
          location: data.location,
          time: data.time,
          riderID: data.riderID,
          riderName: data.riderName
          //pillionID: data.pillionID
        });
        aRide.save((err, obj) => {
          if (err) {
            res.json({ error: err });
          } else {
            res.json({ success: true, ride: aRide });
          }
        });
      })
    })
  },

  getRide: (req, res) => {
    Ride.findOne({ rideID: req.params.rideID }).exec((err, result) => {
      res.json(result);
    });
  },

  accept: (req, res) => {
    let data = req.body;
    Ride.findOne({ rideID: req.params.rideID }, (err, rObj) => {
      rObj.pillionID = data.userID;
      rObj.pillionName = data.username;
      rObj.save((err, result) => {
        if (err) {
          res.json({ error: err });
        } else {
          res.json({ success: true });
        }
      });
    });
  },

  deleteRide: (req, res) => {
    Ride.findOne({ rideID: req.params.rideID }, (err, rObj) => {
      rObj.remove(() => {
        res.json({ success: true });
      });
    });
  },

  getAllRides: (req, res) => {
    Ride.find({ pillionID: '' }).exec((err, result) => {
      res.json(result);
    });
  },

  getMyRides: (req, res) => {
    Ride.find({ riderID: req.params.riderID }).exec((err, result) => {
      res.json(result);
    })
  }
}



let statsSchema = new mongoose.Schema({
  statisticName: { type: String},
  rides: { type: Number, 'default': 0}
});

let Stats = mongoose.model(STATS_COLLECTION, statsSchema);

let stats = {
  incRide: (callback) => {
    Stats.update({ statisticName: 'general' }, { $inc: { rides: 1 }}, () => {
      callback();
    });
  },

  getStats: (callback) => {
    Stats.findOne({ statisticName: 'general' }).exec((err, result) => {
      callback(result);
    });
  }
}

export { ride, stats }
