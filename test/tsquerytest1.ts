// import { tsquery } from '@phenomnomnominal/tsquery';

// const typescript = `

// class Animal {
//     constructor(public name: string) { }
//     move(distanceInMeters: number = 0) {
//         console.log(\`\${this.name} moved \${distanceInMeters}m.\`);
//     }
// }

// class Snake extends Animal {
//     constructor(name: string) { super(name); }
//     move(distanceInMeters = 5) {
//         console.log("Slithering...");
//         super.move(distanceInMeters);
//     }
// }

// `;

// const ast = tsquery.ast(typescript);
// const nodes = tsquery(ast, 'Identifier[name="Animal"]');

// console.log(nodes.length);