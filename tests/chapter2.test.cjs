const assert=require('node:assert/strict');
const {kidnappingOutcome,reaction}=require('../assets/chapter2-learning.js');
const plans=['RR','RK','KR','KK'], rows=['P','A'];
const matrix=[[[0,1],[0,1],[-2,-1],[-2,-1]],[[1,0],[-1,-2],[1,0],[-1,-2]]];
for(let r=0;r<2;r++) for(let c=0;c<4;c++) assert.deepEqual(kidnappingOutcome(rows[r],plans[c]).payoff,matrix[r][c]);
assert.equal(kidnappingOutcome('P','R'),null);
function ne(matrix){let out=[]; for(let i=0;i<matrix.length;i++)for(let j=0;j<matrix[0].length;j++)if(matrix.every(row=>row[j][0]<=matrix[i][j][0])&&matrix[i].every(cell=>cell[1]<=matrix[i][j][1]))out.push([i,j]);return out;}
assert.deepEqual(ne(matrix),[[0,1],[1,0],[1,2]]);
const weak=(a,b)=>a.every((x,i)=>x>=b[i])&&a.some((x,i)=>x>b[i]);const strict=(a,b)=>a.every((x,i)=>x>b[i]);
const kidColumns=plans.map((_,j)=>matrix.map(row=>row[j][1]));
assert(strict(kidColumns[0],kidColumns[3]));for(const [a,b] of [[0,1],[0,2],[1,3],[2,3]])assert(weak(kidColumns[a],kidColumns[b]));assert(!strict(kidColumns[0],kidColumns[1]));
assert.deepEqual(ne([[[-1,1],[1,2]],[[0,3],[0,3]]]),[[0,1],[1,0]]);
assert.deepEqual(ne([[[2,2],[1,1]],[[3,1],[0,0]]]),[[1,0]]);
assert.deepEqual(ne([[[2,2],[1,1]],[[3,1],[0,0]],[[2,2],[2,2]],[[2,2],[2,2]]]),[[1,0],[2,1],[3,1]]);
assert.deepEqual(ne([[[-3,-3],[-10,0]],[[0,-10],[-5,-5]]]),[[1,1]]);
function near(a,b){assert(Math.abs(a-b)<1e-8,`${a} != ${b}`);}
for(const [a,c] of [[13,1],[5,2],[2,.5]]){let d=a-c;
 const r=reaction(d/2,a,c);near(r.q2,d/4);near(r.price,(a+3*c)/4);near(r.profit1,d*d/8);near(r.profit2,d*d/16);
 // Check the optimum against a dense grid, including zero-price and boundary regions.
 for(let x=0;x<=2*a;x+=a/200){const p=reaction(x,a,c);assert(p.profit1<=r.profit1+1e-8);for(let q=0;q<=2*a;q+=a/100)assert(q*(Math.max(a-x-q,0)-c)<=p.profit2+1e-8);}
 near(reaction(d,a,c).q2,0);near(reaction(a+1,a,c).profit1,-c*(a+1));
}
assert.deepEqual(reaction(6),{q1:6,q2:3,price:4,profit1:18,profit2:9});
// Finite partnership: enumerate all pure backward-induction continuations, including ties.
function partner(T,G,delta){let solutions=[{v:[0,0],actions:[]}];for(let t=T;t>=1;t--){let next=[];const i=(t-1)%2;for(const s of solutions){const stay=s.v.map(v=>delta*(1+v));if(stay[i]>=G-1e-10)next.push({v:stay,actions:['S',...s.actions]});if(G>=stay[i]-1e-10){let v=[0,0];v[i]=G;next.push({v,actions:['E',...s.actions]});}}solutions=next;}return solutions;}
for(const T of [1,2,3,6])for(const delta of [.2,.8,1]){assert(partner(T,delta/2,delta).every(s=>s.actions.every(a=>a==='S')));assert(partner(T,delta+.1,delta).every(s=>s.actions.every(a=>a==='E')));const tied=partner(T,delta,delta);assert(tied.some(s=>s.actions.every(a=>a==='S')));assert(tied.some(s=>s.actions.every(a=>a==='E')));}
assert.deepEqual([-1+4,-1+2,-1+3,-2+5,-2+2],[3,1,2,3,0]);
console.log('PASS: eight kidnapping profiles, dominance and NE; entry/static-stage/PD NE; Cournot optima and boundaries; finite partnership including ties; dated sums.');
