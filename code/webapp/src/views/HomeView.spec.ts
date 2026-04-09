import { describe, it, expect } from "vitest";
import { mount } from "@vue/test-utils";
import HomeView from "./HomeView.vue";

describe("HomeView.vue", () => {
  it("should render the title", () => {
    const wrapper = mount(HomeView);
    expect(wrapper.find("h1").text()).toBe("Mentorix");
  });

  it("should render the subtitle in Spanish", () => {
    const wrapper = mount(HomeView);
    expect(wrapper.find("p").text()).toBe(
      "Sistema de Gestión de Asistencia Escolar",
    );
  });
});
