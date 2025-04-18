package com.in6225.ecommerce.ecommerce_store.service.impl;


import com.in6225.ecommerce.ecommerce_store.dto.LoginRequestDto;
import com.in6225.ecommerce.ecommerce_store.dto.UserDto;
import com.in6225.ecommerce.ecommerce_store.entity.User;
import com.in6225.ecommerce.ecommerce_store.exception.ResourceNotFoundException;
import com.in6225.ecommerce.ecommerce_store.mapper.UserMapper;
import com.in6225.ecommerce.ecommerce_store.repository.UserRepository;
import com.in6225.ecommerce.ecommerce_store.security.JwtTokenProvider;
import com.in6225.ecommerce.ecommerce_store.service.UserService;
import lombok.AllArgsConstructor;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@AllArgsConstructor
public class UserServiceImpl implements UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtTokenProvider jwtTokenProvider;

    @Autowired
    private AuthenticationManager authenticationManager; // Spring Security Auth Manager

    /**
     * ✅ Authenticate user & return JWT token
     */
    public Map<String, Object> authenticate(LoginRequestDto loginRequest) {

        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(loginRequest.getUserName(), loginRequest.getPassword())
        );
        // ✅ Generate JWT Token using authenticated user
        String token = jwtTokenProvider.generateToken(authentication);

        // ✅ Retrieve user details
        User user = userRepository.findByUserName(loginRequest.getUserName()).orElseThrow(
                () -> new RuntimeException("User not found")
        );

        // ✅ Create response with JWT and user info
        Map<String, Object> response = new HashMap<>();
        response.put("token", token);
        response.put("userId", user.getUserid());
        response.put("username", user.getUserName());
        response.put("email", user.getEmail());

        return response;
    }


    @Override
    public UserDto createUser(UserDto userDto) {

        User user = UserMapper.mapToUser(userDto);

        // Encrypt the password before saving it
        String encryptedPassword = passwordEncoder.encode(user.getPassword());
        user.setPassword(encryptedPassword);

        User savedUser = userRepository.save(user);
        return UserMapper.mapToUserDto(savedUser);
    }

    @Override
    public UserDto getUserById(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() ->
                        new ResourceNotFoundException("User does not exists with given id : " + userId));

        return UserMapper.mapToUserDto(user);
    }

    @Override
    public List<UserDto> getAllUsers() {
        List<User> users = userRepository.findAll();
        return users.stream().map(UserMapper::mapToUserDto)
                .collect(Collectors.toList());
    }

    @Override
    public UserDto updateUser(Long userId, UserDto updatedUser) {

        User user = userRepository.findById(userId).orElseThrow(
                () -> new ResourceNotFoundException("User does not exists with given id: " + userId)
        );

        user.setFirstName(updatedUser.getFirstName());
        user.setLastName(updatedUser.getLastName());
        user.setUserName(updatedUser.getUserName());
        user.setEmail(updatedUser.getEmail());

        User updatedUserObj = userRepository.save(user);

        return UserMapper.mapToUserDto(updatedUserObj);
    }

    @Override
    public void deleteUser(Long userId) {

        User user = userRepository.findById(userId).orElseThrow(
                () -> new ResourceNotFoundException("User does not exists with given id: " + userId)
        );

        userRepository.deleteById(userId);
    }

    @Override
    public String authenticateUser(LoginRequestDto loginRequestDto) {
        return "";
    }
}

