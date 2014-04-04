define([
	"floom/material",
	"floom/particle",
	"floom/node",
	"floom/obstacle",
	"floom/simulator",
	"floom/system"
], function(Material, Particle, Node, Obstacle, Simulator, System) {
	var Floom = Floom || function() {};

	Floom.Material = Material;
	Floom.Particle = Particle;
	Floom.Node = Node;
	Floom.Obstacle = Obstacle;
	Floom.Simulator = Simulator;
	Floom.System = System;
	
	return Floom;
});
