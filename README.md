# Learn Step Functions

This is a workshop to learn how to develop and deploy [AWS Step Functions] (https://aws.amazon.com/documentation/step-functions/). You can find some tutorials I've written [here](http://vgaltes.com/tags/#serverless).

## Pre-requisites

## Serverless framework

We're going to use the [serverless framework](http://serverless.com) to deploy and test the step functions. The serverless framework is a NodeJS library, so first we'll need to install NodeJs. Go to the [NodeJS] website and install it in your favourite OS.

Once we have NodeJS install, we can install the serverless framework. To do that, open a terminal window and type `npm install serverless -g`. That will install the framework. To check that the installation finished successfully, type `sls -v` to see the installed version of the framework. At the time of writting, you should see `1.16.1`

## .Net Core

You can download the last version of the SDK, but we'll need to target netcoreapp1.0. So, go to the [official website](https://www.microsoft.com/net/core) and follow the instructions for your favourite OS.

## Javascript

If you've followed the steps to install the serverless framework, you should be in a good position to develop using Javascript.

## Python

Download and install the latest version of Python from the [official website](https://www.python.org/downloads/)

## VSCode

I'm going to use VSCode in this workshop (you can use whatever editor you'd like). If you don't have VSCode installed, go to the [official website](https://code.visualstudio.com/) and follow the instructions for you favourite OS.

There are a couple of extensions that will make our live easier. For F# development, download the [ionide](http://ionide.io/) extension. For C# development, download the [C# extension](https://marketplace.visualstudio.com/items?itemName=ms-vscode.csharp).

## AWS

You'll need an AWS account to follow the workshop. You can get one for free [here](https://aws.amazon.com/free/). Once you have the account, you'll need to setup an account so that the serverless framework can interact with AWS. Please, follow the steps explained [here](https://serverless.com/framework/docs/providers/aws/guide/credentials/). My preferred option is to set up an AWS profile. It's a good idea that you give access from the console to that user, so you can connect to it and see the step function running.
