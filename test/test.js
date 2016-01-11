var class1 = function(){
};
class1.prototype.Method1 = function(){
    return "Method1";
};
class1.StaticMethod1 = function(){
    return "StaticMethod1";
};
class1.StaticProp1 = "StaticProp1";
class1.prototype.Prop1 = "Prop1";

var class2 = function(){
};
function confirmMethodExtended(obj, methodName,params, returnValue){
    return typeof obj[methodName] === "function" && obj[methodName](params) === returnValue;
}
function confirmPropExtended(obj, propName, propValue){
    return typeof obj[propName] !== "undefined" && obj[propName] === propValue;
}
QUnit.test("utils extend", function( assert ) {
    komvc.utils.extend(class1, class2);
    var obj = new class2();
    assert.ok(confirmMethodExtended(obj, "Method1", null, "Method1"), "Method 1 in extended");
    assert.ok(confirmPropExtended(obj, "Prop1", "Prop1"), "Prop 1 in extended");
    assert.ok(!confirmMethodExtended(obj, "StaticMethod1", null, "StaticMethod1"), "StaticMethod1 not in extended");
    assert.ok(!confirmPropExtended(obj, "StaticProp1", "StaticProp1"), "StaticProp1 not in extended");
});