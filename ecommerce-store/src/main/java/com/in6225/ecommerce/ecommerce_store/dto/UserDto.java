package com.in6225.ecommerce.ecommerce_store.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class UserDto {
    private Long userId;
    private String firstName;
    private String lastName;
    private String userName;
    private String password;
    private String email;

    // Constructor with password (for input)
    public UserDto(Long userId, String firstName, String lastName, String userName, String email, String password) {
        this.userId = userId;
        this.firstName = firstName;
        this.lastName = lastName;
        this.userName = userName;
        this.email = email;
        this.password = password;
    }

    // Constructor without password (for output)
    public UserDto(Long userId, String firstName, String lastName, String userName, String email) {
        this(userId, firstName, lastName, userName, email, null);
    }
}

