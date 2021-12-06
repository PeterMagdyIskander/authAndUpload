import { CognitoUserPool } from "amazon-cognito-identity-js";

const poolData = {
    UserPoolId: "us-east-1_nASW5MZW5",
    ClientId: "7589rlmdiqj0de3j4aoqj1r4pc"
}

export default new CognitoUserPool(poolData);