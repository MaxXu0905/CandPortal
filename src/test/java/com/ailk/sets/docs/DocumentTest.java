package com.ailk.sets.docs;

import java.net.URI;

import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;
import org.springframework.test.context.web.WebAppConfiguration;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders;
import org.springframework.test.web.servlet.result.MockMvcResultMatchers;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.web.context.WebApplicationContext;
import org.springframework.web.servlet.mvc.method.annotation.MvcUriComponentsBuilder;
import org.springframework.web.util.UriComponents;

import com.ailk.sets.controller.DocController;

@RunWith(SpringJUnit4ClassRunner.class)
@WebAppConfiguration
@ContextConfiguration({ "/spring-servlet.xml", "/consumer.xml" })
public class DocumentTest {

	@Autowired
	private WebApplicationContext wac;

	private MockMvc mockMvc;

	@Before
	public void setup() {
		mockMvc = MockMvcBuilders.webAppContextSetup(wac).build();
	}
	
	@Test
	public void getClassNames() throws Exception {
		UriComponents uriComponents = MvcUriComponentsBuilder.fromMethodName(
				DocController.class, "getClassNames")
				.build();
		URI uri = uriComponents.encode().toUri();
		System.out.println(uri.toString());

		MvcResult mvcResult = mockMvc
				.perform(MockMvcRequestBuilders.get(uri.toString()))
				.andExpect(MockMvcResultMatchers.status().isOk()).andReturn();
		String content = mvcResult.getResponse().getContentAsString();
		System.out.println(content);
	}

	@Test
	public void getByClassName() throws Exception {
		UriComponents uriComponents = MvcUriComponentsBuilder.fromMethodName(
				DocController.class, "getByClassName", "java.lang.Boolean")
				.build();
		URI uri = uriComponents.encode().toUri();
		System.out.println(uri.toString());

		MvcResult mvcResult = mockMvc
				.perform(MockMvcRequestBuilders.get(uri.toString()))
				.andExpect(MockMvcResultMatchers.status().isOk()).andReturn();
		String content = mvcResult.getResponse().getContentAsString();
		System.out.println(content);
	}
	
	@Test
	public void getByName() throws Exception {
		UriComponents uriComponents = MvcUriComponentsBuilder.fromMethodName(
				DocController.class, "getByName", "valueOf")
				.build();
		URI uri = uriComponents.encode().toUri();
		System.out.println(uri.toString());

		MvcResult mvcResult = mockMvc
				.perform(MockMvcRequestBuilders.get(uri.toString()))
				.andExpect(MockMvcResultMatchers.status().isOk()).andReturn();
		String content = mvcResult.getResponse().getContentAsString();
		System.out.println(content);
	}

	@Test
	public void getDescription() throws Exception {
		UriComponents uriComponents = MvcUriComponentsBuilder.fromMethodName(
				DocController.class, "getDescription", "java.lang.Boolean", 0,
				"TRUE").build();
		URI uri = uriComponents.encode().toUri();
		System.out.println(uri.toString());

		MvcResult mvcResult = mockMvc
				.perform(MockMvcRequestBuilders.get(uri.toString()))
				.andExpect(MockMvcResultMatchers.status().isOk()).andReturn();
		String content = mvcResult.getResponse().getContentAsString();
		System.out.println(content);
	}

}
