const sigmoid = (x) => {
    return 1 / (1 + Math.exp(-x));
};

class Neuron {
    constructor(bias, activation) {
        this.bias = bias;
        this.activation = activation;
    }

    getResult(previousLayer, connections) {
        let activation = 0;

        for (const neuron of previousLayer.neurons) {
            const connection = connections.find(
                (connection) =>
                    connection.startNeuron === neuron &&
                    connection.endNeuron === this
            );

            activation += connection.weight * neuron.activation;
        }

        this.activation = sigmoid(activation + this.bias);
    }
}

class Connection {
    constructor(weight, startNeuron, endNeuron) {
        this.weight = weight;
        this.startNeuron = startNeuron;
        this.endNeuron = endNeuron;
    }
}

class Layer {
    constructor(neuronCount) {
        this.neurons = [];

        for (let i = 0; i < neuronCount; i++) {
            this.neurons.push(new Neuron(Math.random(), 0));
        }
    }

    static getResult(layer1, layer2, connections) {
        for (const neuron of layer2.neurons) {
            neuron.getResult(layer1, connections);
        }
    }

    static connect(layer1, layer2) {
        const connections = [];

        for (let i = 0; i < layer1.neurons.length; i++) {
            for (let j = 0; j < layer2.neurons.length; j++) {
                connections.push(
                    new Connection(0, layer1.neurons[i], layer2.neurons[j])
                );
            }
        }

        return connections;
    }
}

class Network {
    constructor(...neuronsCount) {
        this.layers = [];
        this.connections = [];

        this.#generateLayers(neuronsCount);
        this.#generateConnections();
    }

    #generateLayers(neuronsCount) {
        for (const count of neuronsCount) {
            this.layers.push(new Layer(count));
        }
    }

    #generateConnections() {
        for (let i = 0; i < this.layers.length - 1; i++) {
            this.connections.push(
                ...Layer.connect(this.layers[i], this.layers[i + 1])
            );
        }
    }

    getResult() {
        for (let i = 0; i < this.layers.length - 1; i++) {
            Layer.getResult(
                this.layers[i],
                this.layers[i + 1],
                this.connections
            );
        }
    }
}

const network = new Network(30, 6, 4);
network.getResult();