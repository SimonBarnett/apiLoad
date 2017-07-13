Imports Priority.API

Module Main

    Sub Main()
        Do
            Try
                Using cust As New priForm("CUSTOMERS", "CUSTNAME", "CUSTDES")
                    With cust
                        Dim contacts = .AddForm("CUSTPERSONNEL", "FIRSTNAME", "LASTNAME")
                        Dim tasks = .AddForm("CUSTNOTES", "SUBJECT", "CURDATE")
                        Dim addy = contacts.AddForm("BILLTO", "ADDRESS", "ADDRESS2", "ADDRESS3", "ZIP")

                        Dim r As priRow = .AddRow("Cust0001", "Customer")

                        addy.AddRow(
                            contacts.AddRow(
                                r, "Si", "B"
                            ),
                            "49, Great Park", "", "Leyland", "pr253un"
                        )

                        With contacts
                            .AddRow(r, "jo", "B")
                            .AddRow(r, "Emilie", "B")
                        End With

                        With tasks
                            .AddRow(r, "A Task", New Date(2017, 7, 13).ToUniversalTime.ToString)
                            .AddRow(r, "B Task", New Date(2016, 5, 11).ToUniversalTime.ToString)
                        End With


                        Dim ex As New Exception
                        If Not cust.Post(ex) Then
                            Console.WriteLine(cust.toString)
                            Throw ex
                        Else
                            Console.WriteLine("Posted.")

                        End If

                    End With
                End Using

            Catch ex As apiResponse ' Connected, but with errors.   
                Console.WriteLine("{0}: {1}", ex.response, ex.message)
                For Each msg As apiError In ex.msgs
                    Console.WriteLine("  Ln {0}: {1}", msg.Line, msg.message)
                Next

            Catch ex As Exception ' Didn't connect                
                Console.WriteLine(ex.Message)

            Finally
                Console.ReadLine()

            End Try

        Loop

    End Sub

End Module
