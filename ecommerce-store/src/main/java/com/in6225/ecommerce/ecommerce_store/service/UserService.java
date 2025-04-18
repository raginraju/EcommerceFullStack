package com.in6225.ecommerce.ecommerce_store.service;

import com.in6225.ecommerce.ecommerce_store.dto.LoginRequestDto;
import com.in6225.ecommerce.ecommerce_store.dto.UserDto;
import java.util.List;
import java.util.Map;

public interface UserService {

    Map<String, Object> authenticate(LoginRequestDto loginRequest);

    UserDto createUser(UserDto userDto);

    UserDto getUserById(Long userId);

    List<UserDto> getAllUsers();

    UserDto updateUser(Long userId, UserDto updatedUser);

    void deleteUser(Long userId);

    String authenticateUser(LoginRequestDto loginRequestDto);
}

