<h1>.Net Client Example</h1>

<h2>Summary.</h2>
This <a href="https://github.com/SimonBarnett/apiLoad/blob/master/clientExample/Main.vb">example</a> demonstrates usage of the <a href="https://github.com/SimonBarnett/apiLoad/tree/master/apiLoad">.Net API Load Library</a>.

<h2>Usage.</h2>

Defining a form and its columns:

```Visual Basic
Dim form As New priForm("{FORMNAME}", "{COLUMN1}", "{COLUMN2}", ...)
```

Add Subforms to the definition:

```Visual Basic
Dim subform = form.AddForm("{SUBFORMNAME}", "{COLUMN1}", "{COLUMN2}", ...)
```

Adding rows to the loading:

```Visual Basic
Dim r As priRow = form.AddRow("{COLUMN1_DATA}", "{COLUMN2_DATA}", ...)
```

Posting the loading to the server:

```Visual Basic
Dim ex As Exception = Nothing
form.Post(ex)
If Not TypeOf ex Is apiResponse Then Throw (ex)
```

Handling the server <a href="https://github.com/SimonBarnett/apiLoad/blob/master/apiLoad/apiError.vb">response</a>:

```
With TryCast(ex, apiResponse)
    Console.WriteLine("{0}: {1}", .response, .message)
    For Each msg As apiError In .msgs		
        Console.WriteLine("  Ln {0}: {1}", msg.Line, msg.Loaded.ToString)
		If Loaded Then        
            For Each k As String In msg.resultKeys.Keys
                ' Contains key namepairs
            Next            
        Else
            ' Contains msg.message
        End If
    Next
End With
```