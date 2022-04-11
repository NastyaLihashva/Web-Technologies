const assert = require("assert");
let { findIdIndex, findIdItem } = require("../server/routes/functions");
describe("findIdIndex", function () {
    const array = [{id: 1}, {id: 3}, {id: 4}];
    it("findIdIndex проверка #1, id существует", function () {
        assert.equal(0, findIdIndex(array, 1));
        assert.equal(2, findIdIndex(array, 4));
    })
    it("findIdIndex проверка #2, id не существует", function () {
        assert.equal(-1, findIdIndex(array, 2));
        assert.equal(-1, findIdIndex(array, 0));
    })
});

describe("findIdItem", function () {
    const array = [{ id: 1, name: 'Андрей' }, { id: 3, name: 'Елена' }, { id: 4, name: 'Иван' }];
    it("findIdItem проверка #1, id существует", function () {
        assert.equal('Андрей', findIdItem(array, 1).name);
        assert.equal('Елена', findIdItem(array, 3).name);
    })
    it("findIdItem проверка #2, id не существует", function () {
        assert.equal(undefined, findIdItem(array, 2).id);
        assert.equal(undefined, findIdItem(array, 0).id);
    })
});