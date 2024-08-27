---
title: Pull Data from REST APIs to Excel
date: "December 02, 2020"
description: Automate the process of pulling data from REST APIs into Excel using VBA.
---

Recently, I have conducted some research on how to read data from REST APIs using VBA (Visual Basic for Applications) to pull required data into Excel. With the use of VBA scripts, you can call REST APIs and write the required data to your Excel spreadsheet. Once you have created the macro, you can automate the process using an external VBScript and a batch file.

### Create a VBA Macro to Call REST API

In Excel, you can create a VBA macro to call REST APIs and write the data to the spreadsheet. Here is a simple example of a VBA macro that fetches data from a REST API and writes it to an Excel sheet:


```shell
Sub GetDataFromAPI()
    Dim http As Object
    Dim url As String
    Dim response As String
    
    ' Create HTTP request
    Set http = CreateObject("MSXML2.XMLHTTP")
    
    ' Define the REST API endpoint
    url = "https://api.example.com/data"  ' Replace with your API URL
    
    ' Open HTTP request
    http.Open "GET", url, False
    
    ' Send the request
    http.send
    
    ' Get response text
    response = http.responseText
    
    ' Write response to Excel sheet
    WriteToSheet response
End Sub

Sub WriteToSheet(response As String)
    Dim json As Object
    Dim ws As Worksheet
    Dim i As Integer, j As Integer
    
    ' Parse JSON response
    Set json = JsonConverter.ParseJson(response)
    
    ' Set target worksheet
    Set ws = ThisWorkbook.Sheets("Sheet1")
    
    ' Write JSON data to sheet
    i = 1
    For Each item In json
        ws.Cells(i, 1).Value = item("id")
        ws.Cells(i, 2).Value = item("name")
        ws.Cells(i, 3).Value = item("value")
        i = i + 1
    Next item
End Sub

  ```


### Automate the Macro Execution

To automate the macro execution, you can use a VBScript and a batch file. Here are the steps:

```shell
Set objExcel = CreateObject("Excel.Application")
Set objWorkbook = objExcel.Workbooks.Open("C:\Path\To\Your\Workbook.xlsx") ' Replace with your workbook path

objExcel.Application.Visible = False
objExcel.Application.DisplayAlerts = False

objWorkbook.Application.Run "GetDataFromAPI" ' Replace with your macro name

objWorkbook.Save
objWorkbook.Close
objExcel.Application.Quit

  ```

### Create a Batch File to Execute the VBScript

Create a file named RunMacro.bat with the following content:

```shell
@echo off
cscript //nologo C:\Path\To\RunMacro.vbs

  ```

References:

[How to Build a Script in Excel to Call HOPEX REST API](https://www.youtube.com/watch?v=qeB2J9jbpE0)

[Use VBScript to Run Excel Macro](https://www.youtube.com/watch?v=lFSgV2gym9g)

