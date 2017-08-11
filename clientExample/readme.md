<h1>.Net Client Example</h1>

<h2>Summary.</h2>
This example demonstrates usage of the <a href="https://github.com/SimonBarnett/apiLoad/tree/master/apiLoad">.Net API Load Library</a>.

<h2>Usage.</h2>

Defining a form and its columns:

```
Dim form As New priForm("{FORMNAME}", "{COLUMN1}", "{COLUMN2}", ...)
```

Add Subforms to the definition:

```
Dim subform = form.AddForm("{SUBFORMNAME}", "{COLUMN1}", "{COLUMN2}", ...)
```

Adding rows to the loading:

```
Dim r As priRow = form.AddRow("{COLUMN1_DATA}", "{COLUMN2_DATA}", ...)
```

Posting the loading to the server:

```
Dim ex As Exception = Nothing
form.Post(ex)
If Not TypeOf ex Is apiResponse Then
    Throw (ex)
Else
    With TryCast(ex, apiResponse)
        Console.WriteLine("{0}: {1}", .response, .message)
        For Each msg As apiError In .msgs
            Console.WriteLine("  {0}", msg.toString)
        Next
    End With

End If
```