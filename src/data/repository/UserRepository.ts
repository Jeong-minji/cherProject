import { inject, injectable } from "inversify";
import * as Entity from "domain/entity";
import { UserApi } from "data/remote";
import { UserRepository } from "domain/interactor/repository";

@injectable()
export default class UserRepositoryImpl implements UserRepository {
    private userApi: UserApi;

    constructor(@inject("UserApi") userApi: UserApi) {
        this.userApi = userApi;
    }

    postAccount(account : Entity.User): Promise<Entity.User> {
        return this.userApi.postAccount(account);
    }
}