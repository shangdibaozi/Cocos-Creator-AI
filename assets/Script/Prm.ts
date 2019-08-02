let Prm = {
    NumAgents : 1,
    VehicleMass : 1.0,
    SteeringForceTweaker : 200,
    SteeringForce : 2.0,
    MaxSteeringForce : 0,
    MaxSpeed : 150,
    MaxTurnRatePerSecond : Math.PI,
    VehicleScale : 3.0,
    SeekWeight : 1.0,
    FleeWeight : 1.0,
    ArriveWeight : 1.0,
};


Prm.MaxSteeringForce = Prm.SteeringForceTweaker * Prm.SteeringForce;
Prm.SeekWeight = 1.0 * Prm.SteeringForceTweaker;
Prm.FleeWeight = 1.0 * Prm.SteeringForceTweaker;
Prm.ArriveWeight = 1.0 * Prm.SteeringForceTweaker;


export default Prm;