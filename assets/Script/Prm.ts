let Prm = cc.js.createMap();


Prm.NumAgents = 1;
Prm.SeekWeight = 1.0;
Prm.VehicleMass = 1.0;
Prm.SteeringForceTweaker = 200;
Prm.SteeringForce = 2.0;
Prm.MaxSteeringForce = Prm.SteeringForceTweaker * Prm.SteeringForce;
Prm.MaxSpeed = 150;
Prm.MaxTurnRatePerSecond = Math.PI;
Prm.VehicleScale = 3.0;


export default Prm;