let SUCCESS = {
    alert: '',
    request: '',
    get getMessage() {
        return `${this.alert} is ${this.request} successfully`;
    }
};
let INVALID = {
    alert: '',
    get getMessage() {
        return `${this.alert} is invalid`;
    }
};
let NOT_FOUND = {
    alert: '',
    get getMessage() {
        return `${this.alert} is not found`;
    }
}
let EXISIT = {
    alert: '',
    get getMessage() {
        return `${this.alert} has alreay exist`;
    }
}

module.exports = {SUCCESS, INVALID, NOT_FOUND, EXISIT};