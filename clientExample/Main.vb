Imports Priority.API

Module Main

    Sub Main()
        Do
            Try
                Using cust As New priForm("CUSTOMERS", "CUSTNAME", "CUSTDES")
                    With cust
                        Dim contacts = .AddForm("CUSTPERSONNEL", "NAME", "FIRM", "EMAIL")
                        Dim tasks = .AddForm("CUSTNOTES", "SUBJECT", "CURDATE", "STIME", "ETIME")
                        Dim addy = contacts.AddForm("BILLTO", "ADDRESS", "ADDRESS2", "ZIP")

                        Dim r As priRow = .AddRow("Cust0001", "Customer")

                        addy.AddRow(
                            contacts.AddRow(
                                r, "Si B", "Customer", "si@ntsa.org.uk"
                            ),
                            "48 Great Park", "Leyland", "pr25 3un"
                        )

                        addy.AddRow(
                            contacts.AddRow(
                                r, "jo B", "Customer", "jo@ntsa.org.uk"
                            ),
                            "49 Great Park", "Leyland", "pr25 3un"
                        )

                        With contacts
                            .AddRow(r, "Emilie B", "Customer", Nothing)
                        End With

                        With tasks
                            .AddRow(r, "A Task", "2017-08-28T00:00Z", "10:00", "12:00") ', "08/08/17") 'DateDiff(DateInterval.Minute, #1/1/1988#, Now())) 'New Date(2017, 7, 13).ToUniversalTime.ToString)
                            .AddRow(r, "B Task", "2017-08-29T00:00Z", "12:00", "11:00") ', "08/08/17") 'DateDiff(DateInterval.Minute, #1/1/1988#, Now())) 'New Date(2016, 5, 11).ToUniversalTime.ToString)
                        End With

                    End With

                    Dim ex As Exception = Nothing
                    cust.Post(ex, New Uri("http://localhost:8080/demo"))
                    If Not TypeOf ex Is apiResponse Then Throw (ex)

                    With TryCast(ex, apiResponse)
                        Console.WriteLine("{0}: {1}", .response, .message)
                        For Each msg As apiError In .msgs
                            Console.WriteLine("  {0}", msg.toString)
                        Next
                    End With

                End Using

            Catch ex As Exception ' Didn't connect                
                Console.WriteLine(ex.Message)

            Finally
                Console.ReadLine()

            End Try

        Loop

    End Sub

End Module
