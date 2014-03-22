define([
	"jiquid/material",
	"jiquid/particle",
	"jiquid/node",
	"jiquid/obstacle",
	"jiquid/simulator",
	"jiquid/system"
], function(Material, Particle, Node, Obstacle, Simulator, System) {
	var Jiquid = Jiquid || function() {};

	Jiquid.Material = Material;
	Jiquid.Particle = Particle;
	Jiquid.Node = Node;
	Jiquid.Obstacle = Obstacle;
	Jiquid.Simulator = Simulator;
	Jiquid.System = System;
	
	return Jiquid;
});
