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
exports.TransactionsController = void 0;
const common_1 = require("@nestjs/common");
const transactions_service_1 = require("../services/transactions.service");
const createTransactions_dto_1 = require("../dto/createTransactions.dto");
const updateTransaction_dto_1 = require("../dto/updateTransaction.dto");
let TransactionsController = class TransactionsController {
    constructor(transactionService) {
        this.transactionService = transactionService;
    }
    async createTransaction(createDto) {
        return this.transactionService.addTrans(createDto);
    }
    async getAllTransactions(req) {
        try {
            const data = await this.transactionService.getAllTrans();
            if (!data) {
                throw new common_1.NotFoundException('No Transactions Found');
            }
            return data;
        }
        catch (error) {
            throw new common_1.BadRequestException(error.message);
        }
    }
    async getOneTransaction(id) {
        try {
            const OneData = await this.transactionService.getOneTrans(id);
            if (!OneData) {
                throw new common_1.NotFoundException('No transaction Found');
            }
            return OneData;
        }
        catch (error) {
            throw new common_1.BadRequestException(error.message);
        }
    }
    async deleteTransaction(id, req) {
        try {
            const OneData = this.transactionService.getOneTrans(id);
            if (!OneData) {
                throw new common_1.NotFoundException('Transaction not found');
            }
            await this.transactionService.deleteTrans(id);
            return { message: 'Transaction Deleted' };
        }
        catch (error) {
            throw new common_1.BadRequestException(error.message);
        }
    }
    async deleteAllTransactions(id, req) {
        try {
            await this.transactionService.deleteAllTrans();
            return { message: 'All Transactions Deleted' };
        }
        catch (error) {
            throw new common_1.BadRequestException(error.message);
        }
    }
    async updateTransaction(id, updateDTO) {
        try {
            const OneData = this.transactionService.getOneTrans(id);
            if (!OneData) {
                throw new common_1.NotFoundException('Transaction not found');
            }
            const update = await this.transactionService.updateTrans(id, updateDTO);
            return update;
        }
        catch (error) {
            throw new common_1.BadRequestException(error.message);
        }
    }
};
exports.TransactionsController = TransactionsController;
__decorate([
    (0, common_1.Post)('/create'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [createTransactions_dto_1.CreateTransactionsDTO]),
    __metadata("design:returntype", Promise)
], TransactionsController.prototype, "createTransaction", null);
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], TransactionsController.prototype, "getAllTransactions", null);
__decorate([
    (0, common_1.Get)('/:id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], TransactionsController.prototype, "getOneTransaction", null);
__decorate([
    (0, common_1.Delete)('/delete/:id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], TransactionsController.prototype, "deleteTransaction", null);
__decorate([
    (0, common_1.Delete)('/deleteAll'),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], TransactionsController.prototype, "deleteAllTransactions", null);
__decorate([
    (0, common_1.Put)('/update/:id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, updateTransaction_dto_1.updateTransactionDTO]),
    __metadata("design:returntype", Promise)
], TransactionsController.prototype, "updateTransaction", null);
exports.TransactionsController = TransactionsController = __decorate([
    (0, common_1.Controller)('transactions'),
    __metadata("design:paramtypes", [transactions_service_1.TransactionsService])
], TransactionsController);
//# sourceMappingURL=transactions.controller.js.map