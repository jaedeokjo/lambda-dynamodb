/*! Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
 *  SPDX-License-Identifier: MIT-0
 */

// dependencies
const AWS = require('aws-sdk');
const moment = require('moment');
const documentClient = new AWS.DynamoDB.DocumentClient();

exports.create = async (event) => {
    let params = {
        TableName: process.env.DatabaseTable,
        Item: {
            ID: Math.floor(Math.random() * Math.floor(10000000)).toString(),
            created: moment().format('YYYYMMDD-hhmmss'),
            metadata: JSON.stringify(event.body),
        }
    }
    try {
        let data = await documentClient.put(params).promise()
    }
    catch (err) {
        console.log(err)
        return err
    }
    return {
        statusCode: 200,
        body: 'OK!',
    }
}

exports.list = async (event) => {
    const TableName = process.env.DatabaseTable
    let datas = null
    let response = null

    try {
        datas = await documentClient.scan({ TableName }).promise()

    } catch (err) {
        console.log(err);
        return err;
    }
    try {
        response = { statusCode: 200, body: JSON.stringify(datas) }
    } catch (_) {
        response = { statusCode: 200, body: "there is no data in dynamoDB" }
    }
    return response
}