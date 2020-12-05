# Typescript



## 复杂类型



### 类型推导

```typescript
let uname;
uname = 1;
uname = "doctorwu";
uname = null; // OK

let uname2 = "string";
uname2 = 123; // Error 上方表达式已经推导出uname2的类型是 string 类型


```



### 联合类型

```typescript
let name: string |　number;
name = 3; // OK
name = "doctorwu"; // OK
```



### 类型断言

```typescript
let name4: string | number;
(name4! as string).length;
(name4! as any as string).length; // 双重断言

```



### 字面量类型和类型自变量

```typescript
// 字面量类型
const up:"Up" = "Up";
const down:"Down" = "Down";
const left:"Left" = "Left";
const right:"Right" = "Right";
type Direction = "Up"|"Down"|"Left"|"Right";

// 类型自面量
type Person = {
    name:string;
    age:number;
}

let p1:Person = {
    name: "Doctorwu",
    age:10
}
```



## 函数

```typescript
function hello(name:string):void{
    console.log("hello", name);
}

hello("Doctorwu");
```



### 函数类型

```typescript
type GetName = (firstName:string, lastName:string)=>void;

let getName:GetName = function(firstName:string, lastName:string){
    return firstName + lastName;
}
```



### 函数重载

```typescript
let obj:any = {};

/**
* 如果传的value是一个字符串，传递给obj.name
* 如果传的value是一个数字，传递给obj.age
*/
function attr(value:string):void
function attr(value:number):void
function attr(value:any):void{
    if(typeof value === "string"){
        obj.name = value;
    } else if(typeof value){
        obj.age = value;
    }
}
```



## 类

```typescript
export {}  // 出现了export/import, TS会认为该文件是一个模块，不会与其他文件的命名冲突
class Person {
    name: string = "doctorwu";
    getName(){
        return this.name;
    }
}
```



### 存取器

```typescript
class User {
    myName:string;
    constructor(myName:string){
        this.myName = myName;
    }
    get name(){
        return this.myName;
    }
    set name(val:string){
        this.myName = val;
    }
}
```



### 装饰器

```typescript
// 类装饰器

function addName(constructor:Function){
    constructor.prototype.name = "Doctorwu";
}
function addEat(constructor:Function){
    constructor.prototype.eat = function(){
        console.log("eat");
    }
}

@addName
@addEat
class Person {
    name!:string;
	eat!:Function;
    constructor(){
    }
}


// 类装饰器替换类
function replaceClass (constructor:Function){
    return class {
        // 只能多，不能少
        name:string;// 不能没有
        eat:Function;// 不能没有
        custom:any;
        constructor(){}
    }
}

@replaceClass
class People {
    name:string;
    eat:string;
    constructor(){};
}

```



```typescript
// 属性装饰器
// 装饰属性
// 装饰方法


// 如果装饰的是实例属性的话，target是构造函数原型
function upperCase(target:any, propertyKey:string){
    let value = target[propertyKey];
    const getter = ()=>value;
    const setter = (newVal:string)=>{value = newVal.toUpperCase()}
    
    if(delete target[propertyKey]){
        Object.defineProperty(target, propertyKey,{
            get:getter,
            set:setter,
            enumerable:true,
            configurable:true
        })
    }
}
// 如果装饰的是静态属性的话，target是构造函数本身
function staticPropertyDecorator(target:any, propertyKey:string){
    console.log(target, propertyKey);
}


function noEnumerable(target:any, propertyKey:string, descriptor:PropertyDescriptor){
    console.log(target, propertyKey,descriptor);
    descriptor.enumerable = false;
}

function toNumber(target:any, propertyKey:string, descriptor:PropertyDescriptor){
    let oldMethod = descriptor.value;
    descriptor.value = function (...args:any[]){
        oldMethod.apply(this, args.map(i=>parseFloat(i)))
    }
}





class Person {
    @upperCase
    name:string = "Doctorwu";
    
    @staticPropertyDecorator
    public static age:number = 10;
    @noEnumerable
    getName(){console.log(this.name)}
	sum(...args:any[]){
        return args.reduce((accu:number, item:number)=>accu+item,0)
    }
}
```



```typescript
// 参数装饰器
namespace paramDecorator {
    // target 静态成员就是构造函数 非静态成员就是构造函数原型 methodname 这个参数所属方法的名称 paramIndex 参数的索引
    function addAge(target:any, methodName:string,paramIndex:number){
        console.log(target, methodName, paramIndex);
        target.age = 10;
    }
    
    class Person {
        age:number;
        login(username:string,@addAge password:string){
            console.log(username, password)
        }
    }
    let p = new Person();
    p.login("1", "2");
}
```



### 抽象类

- 抽象描述一种抽象的概念，无法被实例化，只能被继承
- 无法创建抽象类的实例
- 抽象方法不能在抽象类中实现，只能在抽象类的具体子类中实现，而且必须实现

```typescript
abstract class Animal {
    name:string;
    abstract speak():void
}

class Cat extends Animal {
    speak():void {
        console.log("喵喵喵")
    }
}


```



## 接口

- 接口一方面可以在面向对象编程中表示为**行为的抽象**，另外可以用来描述**对象的形状**
- 接口就是把一些类中共有的属性和方法抽象出来，可以用来约束实现此接口的类
- 一个类可以继承另一个类并实现多个接口
- 接口像插件一样是用来增强类的，而抽象类是具体类的抽象概念
- 一个类可以实现多个接口，一个接口也可以被多个类实现，但一个类可以有多个子类，但只能有一个父类
- **同名的接口可以写多个，类型会自动合并**



### 接口描述类

当我们写一个类的时候，会得到两种类型

1. 构造函数类型的函数类型  clazz:typeof Cstr
2. 类的实例类型clazz:Cstr

```typescript
// 接口约束类
interface Speakable{
    speak():void;
}// 实现的类中实现speak方法即可


// 接口修饰构造函数
class Animal{
    constructor(public name:string){
        
    }
}

// 修饰普通函数的接口加上new之后就是用来描述构造函数类型的接口
interface WithNameClass{
    new(name:string):Animal
}

function createAnimal(clazz:WithNameClass, name:string){
    return new clazz(name);
}
let a = createAnimal(Animal, "Dog");
console.log(a.name)

```



## 泛型

```typescript
// 泛型工厂
function factory<T>(Cstr:{new():T}):T{
    return new Cstr();
}


// 泛型接口
interface Calculate<T>{
    <U>(a:T, b:T):U
}
let sum:Calculate<number> = function<U>(a:T,b:T):U{
    return a+b;
}

console.log(sum<number>(1,2))
```



### **泛型可以写多个**

```typescript
function swap<A,B>(tuple:[A,B]):[B,A]{
    return [tuple[1], tuple[0]]
}
```



### 默认泛型

```typescript
interface T2<T = string>{
    // ...
}

type T22 = T2/*<T>此处取了默认泛型string*/;
```



### 泛型约束

```typescript
interface LengthWise {
    length: number
}

function logger<T extends LengthWise>(val: T) {
    console.log(val.length);
}

let obj = {
    length: 10
}
type withLengthObj = typeof obj;

logger<withLengthObj>("doctorwu");// 传入的参数需要满足Lengthwise 
```



### 泛型类型别名

```typescript
type Cart<T> = {list:T[]}|T[];

let c1:Cart<string> = {list:['1']}
let c2:Cart<number> = [1,2,3]
```

**泛型接口 vs 泛型类型别名**

- 接口创建了一个新的名字，它可以在其他任意地方被调用。而类型别名(**type**)并不创建新的名字，例如报错信息就不会使用别名
- 类型别名不能被extends和implements，这时我们应该尽量使用接口替代类型别名
- 当我们需要使用**联合类型或者元组类型**的时候，**类型别名会更合适**
- **能用interface实现的就不要用type**



### compose泛型

```typescript
function sum(A: number, b: number = 5): number {
    return A + b;
}

function concatString(a: string, b: string = ""): string {
    return a + b;
}

type Func<T extends any[], R> = (...a: T) => R;
/* zero functions */
console.log(compose()(1));
console.log(compose(sum)(1));
console.log(compose(sum, sum)(1));
console.log(compose(sum, sum, concatString)(1));
console.log(compose(sum, concatString, sum, sum)(1));
console.log(compose(sum, sum, sum, sum, sum)(1));
console.log(compose(sum, sum, sum, sum, sum, sum)(1));
export default function compose(): <R>(a: R) => R;

/* one functions */
export default function compose<F extends Function>(f1: F): F;

/* two functions */
export default function compose<A, T extends any[], R>(
    f1: (a: A) => R,
    f2: Func<T, A>
): Func<T, R>;

/* three functions */
export default function compose<A, B, T extends any[], R>(
    f1: (a: B) => R,
    f2: (a: A) => B,
    f3: Func<T, A>
): Func<T, R>;

/* four functions */
export default function compose<A, B, C, T extends any[], R>(
    f1: (a: C) => R,
    f2: (a: B) => C,
    f3: (a: A) => B,
    f4: Func<T, A>
): Func<T, R>;


/* rest */
export default function compose<R>(
    f1: (a: any) => R,
    ...funcs: Function[]
): (...args: any[]) => R;

// export default function compose<R>(...funcs: Function[]): (...args: any[]) => R;

export default function compose(...funcs: Function[]) {
    if (funcs.length === 0) {
        return <T>(arg: T): T => arg;
    }
    if (funcs.length === 1) {
        return funcs[0];
    }


    return funcs.reduce((a, b) => (...args: any) => a(b(...args)));
}

```



## 结构类型系统



### 接口的兼容性

- 如果传入的变量和声明的类型不匹配，TS就会进行兼容性检查
- 原理是Duck-Check，就是说只要目标类型中声明的属性变量在原类型中都存在就是兼容的

### 函数的兼容性 (难点)

```typescript
// 比较参数
type Func = (a:number, b:number)=>void;

let sum:Func;

function f1(a:number, b:number):void{
}

sum = f1; // OK

function f2(a:number):void{}

sum = f2; // OK 参数可以少


function f3(a:number, b:number,c:number):void{}

// sum = f3; // Error 参数不能多



// 比较返回值
type GetPerson = ()=>{name:string,age:number}
let getPerson:GetPerson;

function g1(){
    return {name:"doctorwu", age:20};
}

getPerson = g1; // OK

function g2(){
    return {name:"doctorwu", age:20,gender:0};
}

getPerson = g2; // OK

function g3(){
    return {name:"doctorwu"};
}

getPerson = g3; // Error 返回的属性不能少
```



### 函数的协变和逆变

- A <= B 意味着A是B的子类型

- A -> B 指的是以A为参数类型，以B为返回值类型的函数参数

- x：A 意味着x的类型为A

- 函数的返回值类型是**协变**的，而参数类型是**逆变**的

- 返回值类型可以传子类(只能多不能少)，参数可以传父类(只能少不能多)

- 参数逆变父类 返回值协变子类

  

**如果关闭 "strictFunctionTypes" 选项的话，ts中的函数是双向协变的(算是个bug)**

```typescript
export {}

class Animal {
}

class Dog extends Animal {
    public name!: string;
}

class BlackDog extends Dog {
    public color!: string;
}

type Callback = (dog: Dog) => Dog;

function exec(callback: Callback): void {
}

/**
 * 参数可以传自己和自己逆变成的父类
 * 返回值可以传自己和自己协变成的子类
 * 四种情况
 * 1. 参数传子类，返回值子类 n
 * 2. 参数传子类，返回值父类 n
 * 3. 参数传父类，返回值父类 n
 * 4. 参数传父类，返回值子类 y
 * */

type ChildToChild = (blackDog: BlackDog) => BlackDog;
let childToChild: ChildToChild = (bD: BlackDog) => bD;
// exec(childToChild); Error

type ChildToParent = (blackDog: BlackDog) => Animal;
let childToParent: ChildToParent = (bD: BlackDog) => new Animal();
// exec(childToParent); Error

type ParentToParent = (animal: Animal) => Animal;
let parentToParent: ParentToParent = (animal: Animal) => new Animal();
// exec(parentToParent); Error

type ParentToChild = (animal: Animal) => BlackDog;
let parentToChild: ParentToChild = (animal: Animal) => new BlackDog();
exec(parentToChild);  // OK

```



## 类型保护

- 类型保护就是一些表达式，他们在编译的时候就能通过类型信息确保某个作用域变量的类型

- 类型保护就是能够通过关键字判断出分支中的类型

  

### typeof类型保护

```typescript
function double(input:string|number){
    if(typeof input === "string"){
        console.log(input); // 类型系统可以认知到string
    }else if(typeof input === "number"){
        console.log(input); // 类型系统可以认知到number
    }
}
```



### instanceof类型保护

```typescript
class Animal{
    
}

class Bird extends Animal {
    
}

class Dog extends Animal {
    
}

function getName(animal:Animal){
    if(animal instanceof Bird){
        // 类型系统可以认知到Bird
    }else if(animal instanceof Dog){
        // 类型系统可以认知到Dog
    }
}
```



### null保护

```typescript
function getFirstLetter(s:string|null){
    if(s===null){
        return "";
    }
    s.length; // 类型系统会排除掉null的情况
    
    
    s = s||""; // 这样也可以让类型系统排除null
}
```



### 链判断运算符

```typescript
let a = {b:2};
let result = a?.b; // 如果a不为空则返回a.b否则返回undefined
console.log(result);
```



### 可辩识的联合类型

```typescript
interface WarningButton{
    className: "warning",
    text1: "修改"
}

interface DangerButton{
    className: "danger",
    text1: "删除"
}

type Button = WarningButton | DangerButton;

function getName(button:Button){
    if(button.className==="warning"){
        console.log(button.text1); // OK
    }
    if(button.className==="danger"){
        console.log(button.text1); // OK
    }
}
```



### 自定义的类型保护(难点)

```typescript
interface Bird{
    leg: number;
    birdLeg: number;
}
interface Dog{
    leg: number;
    dogLeg: number;
}

function isBird(x:any):x is Bird{
    return x.leg === 2;
}

function getLeg(x:Bird|Dog):number{
    if(isBird(x)){
        return x.birdLeg;
    }else{
        return x.dogLeg;
    }
}
```



### unknown

unknown 是any的安全类型

- any, 我们可以对any进行任何操作，而不需要类型检查
- unknown，任何类型都可以覆盖unknown类型，但是unknown不能随意调用方法
- 如果想调用unknown上的方法和属性
  - 断言，(unknown as string).length
- 联合类型中，unknown会吸收任何类型
- never是unknown的子类型 






































