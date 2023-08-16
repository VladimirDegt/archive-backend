# Connections API ![Render](https://img.shields.io/badge/Render-%46E3B7.svg?style=for-the-badge&logo=render&logoColor=white)

[Volodymyr Dehtiarev - Website](https://github.com/VladimirDegt)

---

##### Servers:

[https://contacts-api-3i4o.onrender.com/api/contacts](https://contacts-api-3i4o.onrender.com/api/contacts)

### Contacts

<table>
    <tr >
        <th align="center">GET</th>
        <th align="center">GET</th>
        <th align="center">POST</th>
        <th align="center">DELETE</th>
        <th align="center">PUT</th>
        <th align="center">PATCH</th>
    </tr>
    <tr>
        <td align="center">/</td>
         <td align="center">/:contactId</td>
        <td align="center">/</td>
        <td align="center">/:contactId</td>
        <td align="center">/:contactId</td>
        <td align="center">/:contactId/favorite</td>
    </tr>
    <tr>
        <td>Get all user contacts</td>
        <td>Get one user contact</td>
        <td>Create a new contact</td>
        <td>Delete contact</td>
        <td>Update contact</td>
        <td>Update field favorite</td>
    </tr>
</table>

##### Servers:

[https://contacts-api-3i4o.onrender.com/users](https://contacts-api-3i4o.onrender.com/api/contacts)

### Users

<table>
    <tr >
        <th align="center">GET</th>
        <th align="center">POST</th>
        <th align="center">POST</th>
        <th align="center">POST</th>
        <th align="center">PATCH</th>
    </tr>
    <tr>
        <td align="center">/current</td>
         <td align="center">/register</td>
        <td align="center">/login</td>
        <td align="center">/logout</td>
        <td align="center">/</td>
    </tr>
    <tr>
        <td>Get current user</td>
        <td>Registration</td>
        <td>Login</td>
        <td>Logout</td>
        <td>Update field subscription</td>
    </tr>
</table>

