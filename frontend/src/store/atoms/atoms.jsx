import { atom } from "recoil";

export const firstname = atom({
    key: 'firstname',
    default: ""
});

export const lastname = atom({
    key: 'lastname',
    default: ""
});

export const email = atom({
    key: 'email',
    default: ""
});

export const pass = atom({
    key: 'pass',
    default: ""
});

export const usersData = atom({
    key: 'usersData',
    default: []
});

export const filterData = atom({
    key: 'filterData',
    default: ""
});

export const transferAmount = atom({
    key: 'transferAmount',
    default: 0
});

export const currentBalance = atom({
    key: 'currentBalance',
    default: 0
});