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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TransactionsService = void 0;
const common_1 = require("@nestjs/common");
const TransactionsSchema_1 = require("../TransactionsSchema");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
let TransactionsService = class TransactionsService {
    constructor(TransactionRepo) {
        this.TransactionRepo = TransactionRepo;
    }
    async addTrans(createDto) {
        const transaction = await this.TransactionRepo.save(createDto);
        return transaction;
    }
    async getAllTrans() {
        const allData = await this.TransactionRepo.find();
        return allData;
    }
    async getOneTrans(id) {
        const OneData = await this.TransactionRepo.find({ where: { id } });
        return OneData;
    }
    async deleteTrans(id) {
        const del = await this.TransactionRepo.delete({ id });
        return del;
    }
    async deleteAllTrans() {
        await this.TransactionRepo.clear();
    }
    async updateTrans(id, updateDto) {
        await this.TransactionRepo.update(id, updateDto);
        const updatedTransaction = await this.TransactionRepo.findOne({ where: { id } });
        return updatedTransaction;
    }
};
exports.TransactionsService = TransactionsService;
exports.TransactionsService = TransactionsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(TransactionsSchema_1.Transactions)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], TransactionsService);
//# sourceMappingURL=transactions.service.js.map