package com.example.demo.model;

import jakarta.persistence.*;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import com.fasterxml.jackson.annotation.JsonIdentityInfo;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import com.fasterxml.jackson.annotation.ObjectIdGenerators;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.ArrayList;
import java.util.Collection;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name="tbl_users")
@JsonIgnoreProperties({"password"})
public class User implements UserDetails{
	@Id
	@GeneratedValue
	private Integer id;
	private String firstName;
	private String lastName;
	private String email;
	private String password;
	

	@Builder.Default
	@Enumerated(EnumType.STRING)
	private Role role = Role.USER;

	@Override
	public Collection<? extends GrantedAuthority> getAuthorities() {
		return List.of(new SimpleGrantedAuthority(role.name()));
	}

	@Override
	public String getPassword() {
		return password;
	}

	@Override
	public String getUsername() {
		return email;
	}

	@Override
	public boolean isAccountNonExpired() {
//		return UserDetails.super.isAccountNonExpired();
		return true;
	}

	@Override
	public boolean isAccountNonLocked() {
//		return UserDetails.super.isAccountNonLocked();
		return true;
	}

	@Override
	public boolean isCredentialsNonExpired() {
//		return UserDetails.super.isCredentialsNonExpired();
		return true;
	}

	@Override
	public boolean isEnabled() {
//		return UserDetails.super.isEnabled();
		return true;
	}
}

