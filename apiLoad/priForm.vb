Public Class priForm : Implements IDisposable

    Private _name As String
    Private _columns As New List(Of String)
    Private _Subforms As New Dictionary(Of String, priForm)

#Region "Constructor"

    Sub New(Name As String, ParamArray Columns() As String)
        _name = Name
        forms.Add(Name)
        For Each c As String In Columns
            _columns.Add(c)
        Next
    End Sub

#End Region

#Region "Public Properties"

    Public ReadOnly Property Name As String
        Get
            Return _name
        End Get
    End Property

    Public ReadOnly Property Subforms As Dictionary(Of String, priForm)
        Get
            Return _Subforms
        End Get
    End Property

    Public ReadOnly Property Columns As List(Of String)
        Get
            Return _columns
        End Get
    End Property

    Public Property Port As Integer
        Get
            Return thisport
        End Get
        Set(value As Integer)
            thisport = value
        End Set
    End Property

#End Region

#Region "Methods"

    Public Function AddForm(Name As String, ParamArray Columns() As String) As priForm

        If Not forms.Contains(Name) Then
            forms.Add(Name)
            _Subforms.Add(Name, New priForm(Name, Columns))
            Return _Subforms(Name)

        Else
            Throw New Exception(String.Format("Form {0} may only be defined once per loading.", Name))

        End If

    End Function

    Public Function AddRow(ParamArray RowData() As String) As priRow

        rows.Add(New priRow(Me, RowData))
        Return rows.Last

    End Function

    Public Function AddRow(Parent As priRow, ParamArray RowData() As String) As priRow

        If Parent.SubForms.Keys.Contains(Me.Name) Then
            Parent.Add(New priRow(Me, RowData))
            Return Parent.Last

        Else
            Throw New Exception(
                String.Format(
                    "Cannot add row of type '{0}' to row of type '{1}'.",
                    Name,
                    Parent.FormName
                )
            )

        End If

    End Function
    Public Function Post(ByRef ex As Exception, Optional ByVal Env As String = "", Optional Port As Integer = 8080) As Boolean
        Dim uploadRequest As Net.HttpWebRequest = CType(
        Net.HttpWebRequest.Create(
            String.Format(
                "http://localhost:{0}/{1}",
                Port.ToString,
                Env
            )
        ),
        Net.HttpWebRequest
    )
        Return rows.Post(ex, uploadRequest)
    End Function

    Public Function Post(ByRef ex As Exception, Optional ByVal host As Uri = Nothing) As Boolean

        Dim prot As String
        Select Case host.Scheme
            Case Uri.UriSchemeHttp
                prot = "http"
            Case Uri.UriSchemeHttps
                prot = "https"
            Case Else
                Throw New UriFormatException
        End Select

        Dim uploadRequest As Net.HttpWebRequest = CType(
            Net.HttpWebRequest.Create(
                String.Format(
                    "{0}://{1}:{2}/{3}",
                    prot,
                    host.Host,
                    host.Port.ToString(),
                    Split(host.AbsolutePath, "/")(1)
                )
            ),
            Net.HttpWebRequest
        )
        Return rows.Post(ex, uploadRequest)

    End Function

    Public Overrides Function toString() As String
        Return rows.toString()

    End Function

#End Region

#Region "IDisposable Support"

    Private disposedValue As Boolean ' To detect redundant calls

    ' IDisposable
    Protected Overridable Sub Dispose(disposing As Boolean)
        If Not disposedValue Then
            If disposing Then
                rows.Clear()
                rows = New Data
                forms = New List(Of String)
                rowid = 0
            End If

            ' TODO: free unmanaged resources (unmanaged objects) and override Finalize() below.
            ' TODO: set large fields to null.
        End If
        disposedValue = True
    End Sub

    ' TODO: override Finalize() only if Dispose(disposing As Boolean) above has code to free unmanaged resources.
    'Protected Overrides Sub Finalize()
    '    ' Do not change this code.  Put cleanup code in Dispose(disposing As Boolean) above.
    '    Dispose(False)
    '    MyBase.Finalize()
    'End Sub

    ' This code added by Visual Basic to correctly implement the disposable pattern.
    Public Sub Dispose() Implements IDisposable.Dispose
        ' Do not change this code.  Put cleanup code in Dispose(disposing As Boolean) above.
        Dispose(True)
        ' TODO: uncomment the following line if Finalize() is overridden above.
        ' GC.SuppressFinalize(Me)
    End Sub

#End Region

End Class