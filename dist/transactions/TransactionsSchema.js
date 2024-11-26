"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Transactions = void 0;
const typeorm_1 = require("typeorm");
let Transactions = class Transactions {
};
exports.Transactions = Transactions;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], Transactions.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 10, scale: 2 }),
    __metadata("design:type", Number)
], Transactions.prototype, "amount", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'vendorname', nullable: false }),
    __metadata("design:type", String)
], Transactions.prototype, "vendorName", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'transactiondate', type: 'timestamp', nullable: false }),
    __metadata("design:type", Date)
], Transactions.prototype, "transactionDate", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Transactions.prototype, "category", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'paymentmethod', type: 'enum', enum: ['cash', 'credit_card', 'debit_card', 'other'], default: 'other' }),
    __metadata("design:type", String)
], Transactions.prototype, "paymentMethod", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'cardlastfourdigits', nullable: true }),
    __metadata("design:type", String)
], Transactions.prototype, "cardLastFourDigits", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], Transactions.prototype, "place", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true, default: null }),
    __metadata("design:type", String)
], Transactions.prototype, "notes", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'createdat' }),
    __metadata("design:type", Date)
], Transactions.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ name: 'updatedat' }),
    __metadata("design:type", Date)
], Transactions.prototype, "updatedAt", void 0);
exports.Transactions = Transactions = __decorate([
    (0, typeorm_1.Entity)({ schema: 'public', name: 'transactions' })
], Transactions);
//# sourceMappingURL=TransactionsSchema.js.map