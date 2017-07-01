Imports System.IO
Imports System.Text
Imports Newtonsoft.Json.Linq

Public Class Data : Inherits List(Of priRow)

#Region "Private Properties"

    Private _encode As Encoding = Encoding.GetEncoding("utf-8")

    Private ReadOnly Property toByte() As Byte()
        Get
            Dim myEncoder As New System.Text.ASCIIEncoding
            Dim str As New System.Text.StringBuilder
            With str
                .Append(toString)
                Return myEncoder.GetBytes(.ToString)
            End With
        End Get
    End Property

#End Region

#Region "Methods"

    Public Overrides Function toString() As String
        Dim str As New Text.StringBuilder
        With str
            .Append("{ ")
            .AppendFormat("""{0}"": [ ", rows(0).FormName)
            For Each r As priRow In rows
                .AppendFormat("{0}", r.toString)
                If Not r.id = rows.Last.id Then
                    .Append(", ")
                End If
            Next
            .Append("] }")

            Return .ToString
        End With
    End Function

    Public Function Post(ByRef Ex As Exception) As Boolean

        Dim posted As Boolean = False
        Dim uploadResponse As Net.HttpWebResponse = Nothing
        Dim requestStream As Stream = Nothing
        Ex = Nothing

        Try

            Dim ms As MemoryStream = New MemoryStream(toByte)
            Dim uploadRequest As Net.HttpWebRequest = CType(
                Net.HttpWebRequest.Create(
                    String.Format(
                        "http://localhost:{0}",
                        thisport.ToString
                    )
                ),
                Net.HttpWebRequest
            )

            uploadRequest.Method = "POST"
            uploadRequest.Proxy = Nothing
            uploadRequest.SendChunked = True
            requestStream = uploadRequest.GetRequestStream()

            ' Upload the XML
            Dim buffer(1024) As Byte
            Dim bytesRead As Integer
            While True
                bytesRead = ms.Read(buffer, 0, buffer.Length)
                If bytesRead = 0 Then
                    Exit While
                End If
                requestStream.Write(buffer, 0, bytesRead)
            End While

            ' The request stream must be closed before getting the response.
            requestStream.Close()
            uploadResponse = uploadRequest.GetResponse()

            Dim readstream As New StreamReader(uploadResponse.GetResponseStream(), _encode)
            Ex = New apiResponse(JObject.Parse(readstream.ReadToEnd))
            posted = (TryCast(Ex, apiResponse).response = 200)

        Catch exep As UriFormatException
            Ex = New Exception(String.Format("Invalid URL: {0}", exep.Message))

        Catch exep As Net.WebException
            Ex = New Exception(String.Format("Connection Error: {0}", exep.Message))

        Catch exep As Exception
            Ex = New Exception(String.Format("Posting failed: {0}", exep.Message))

        Finally
            ' Clean up the streams
            If Not IsNothing(uploadResponse) Then
                uploadResponse.Close()
            End If
            If Not IsNothing(requestStream) Then
                requestStream.Close()
            End If
        End Try

        Return posted

    End Function

#End Region

End Class

