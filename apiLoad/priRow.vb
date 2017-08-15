Imports Newtonsoft.Json

Public Class priRow : Inherits List(Of priRow) : Implements IDisposable

    Private _Rowdata As New Dictionary(Of String, String)
    Private _Form As priForm
    Private _id As Integer

#Region "Constructors"

    Sub New(ByRef Form As priForm, ParamArray RowData() As String)

        _Form = Form
        rowid += 1
        _id = rowid

        If Not (_Form.Columns.Count - 1 = UBound(RowData)) Then
            Throw New Exception(
                String.Format(
                    "Parameter mismatch adding row to form {0}.",
                    _Form.Name
                )
            )
        Else
            For i As Integer = 0 To UBound(RowData)
                _Rowdata.Add(_Form.Columns(i), RowData(i))
            Next
        End If

    End Sub

#End Region

#Region "Properties"

    Public ReadOnly Property id As Integer
        Get
            Return _id
        End Get
    End Property

    Public ReadOnly Property RowData As Dictionary(Of String, String)
        Get
            Return _Rowdata
        End Get
    End Property

    Public ReadOnly Property FormName As String
        Get
            Return _Form.Name
        End Get
    End Property

    Public ReadOnly Property SubForms As Dictionary(Of String, priForm)
        Get
            Return _Form.Subforms
        End Get
    End Property

#End Region

#Region "Methods"

    Public Sub toJson(ByRef wr As JsonTextWriter)

        wr.WritePropertyName("$LN")
        wr.WriteValue(Me.id)

        For Each colname As String In _Rowdata.Keys
            If Not RowData(colname) Is Nothing Then
                wr.WritePropertyName(colname)
                wr.WriteValue(RowData(colname))
            End If
        Next

        For Each sfk As String In _Form.Subforms.Keys
            Dim start As Boolean = False
            For Each row As priRow In Me
                If String.Compare(row.FormName, sfk) = 0 Then
                    If Not start Then
                        start = True
                        wr.WritePropertyName(sfk)
                        wr.WriteStartArray()
                    End If

                    wr.WriteStartObject()
                    row.toJson(wr)
                    wr.WriteEndObject()

                End If
            Next
            If start Then wr.WriteEndArray()
        Next

    End Sub

#End Region

#Region "IDisposable Support"

    Private disposedValue As Boolean ' To detect redundant calls

    ' IDisposable
    Protected Overridable Sub Dispose(disposing As Boolean)
        If Not disposedValue Then
            If disposing Then
                ' TODO: dispose managed state (managed objects).
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