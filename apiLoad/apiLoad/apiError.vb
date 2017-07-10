Imports Newtonsoft.Json.Linq

Public Class apiResponse : Inherits Exception

    Public Sub New(json As JObject)
        _response = json.SelectToken("apiResponse").SelectToken("response")
        _message = json.SelectToken("apiResponse").SelectToken("message")

        For Each m As JObject In json.SelectToken("apiResponse").SelectToken("msgs")
            msgs.Add(New apiError(m.SelectToken("line"), m.SelectToken("message")))
        Next

    End Sub

    Private _response As Integer
    Public Property response As Integer
        Get
            Return _response
        End Get
        Set(value As Integer)
            _response = value
        End Set
    End Property

    Private _message As String
    Public Overrides ReadOnly Property message As String
        Get
            Return _message
        End Get
    End Property

    Private _msgs As New List(Of apiError)
    Public Property msgs As List(Of apiError)
        Get
            Return _msgs
        End Get
        Set(value As List(Of apiError))
            _msgs = value
        End Set
    End Property

End Class

Public Class apiError

    Sub New(Line, Message)
        Try
            _Line = Line
        Catch ex As Exception
            _Line = 0
        Finally
            _message = Message
        End Try

    End Sub

    Private _Line As Integer
    Public Property Line As Integer
        Get
            Return _Line
        End Get
        Set(value As Integer)
            _Line = value
        End Set
    End Property

    Private _message As String
    Public Property message As String
        Get
            Return _message
        End Get
        Set(value As String)
            _message = value
        End Set
    End Property

End Class