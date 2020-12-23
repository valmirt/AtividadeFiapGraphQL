const express = require("express")
const { ApolloServer } = require("apollo-server-express")
const admin = require('firebase-admin')
const functions = require('firebase-functions')

const { importSchema } = require('graphql-import')
const resolvers = require('./resolvers')

const serviceAccount = require("./banco-valmirt-firebase.json")

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://fiapbancographql-valmirt-default-rtdb.firebaseio.com/",
})

const app = express()

const server = new ApolloServer({
    typeDefs: importSchema("./schema/index.graphql"),
    resolvers: resolvers,
})

server.applyMiddleware({ app, path: "/", cors: true })
exports.graphql = functions.https.onRequest(app)